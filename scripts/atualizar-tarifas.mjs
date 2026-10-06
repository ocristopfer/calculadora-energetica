#!/usr/bin/env node
// Atualiza src/data/tarifas.json com as tarifas vigentes publicadas pela ANEEL.
// Uso: node scripts/atualizar-tarifas.mjs [--opcional]
//   --opcional  não falha (exit 0) se a ANEEL estiver fora do ar; mantém o JSON atual.
import { readFile, writeFile } from 'node:fs/promises'
import {
  API_URL,
  CSV_URL,
  RESOURCE_ID,
  aplicarTarifas,
  linhaResidencialB1,
  parseLinhaCsv,
  tarifasVigentes,
} from './tarifas-aneel.mjs'

const ARQUIVO = new URL('../src/data/tarifas.json', import.meta.url)
const opcional = process.argv.includes('--opcional')
const hoje = new Date().toISOString().slice(0, 10)
const MINIMO_ATUALIZADAS = 15

const buscarJson = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(120_000) })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} em ${url}`)
  return res.json()
}

/** Busca pela API (datastore) já filtrando B1 convencional */
const buscarViaApi = async () => {
  const filtros = JSON.stringify({
    DscSubGrupo: 'B1',
    DscModalidadeTarifaria: 'Convencional',
  })
  const linhas = []
  const limite = 10_000
  for (let offset = 0; ; offset += limite) {
    const url = `${API_URL}?resource_id=${RESOURCE_ID}&limit=${limite}&offset=${offset}&filters=${encodeURIComponent(filtros)}`
    const { result } = await buscarJson(url)
    linhas.push(...result.records)
    if (result.records.length < limite || linhas.length >= result.total) break
  }
  return linhas
}

/** Alternativa: baixa o CSV completo em streaming e filtra linha a linha */
const buscarViaCsv = async () => {
  const res = await fetch(CSV_URL, { signal: AbortSignal.timeout(600_000) })
  if (!res.ok || !res.body) throw new Error(`${res.status} ao baixar CSV`)
  const bytes = []
  for await (const parte of res.body) bytes.push(parte)
  const buffer = Buffer.concat(bytes)
  let texto = new TextDecoder('utf-8').decode(buffer)
  if (texto.slice(0, 2000).includes('�'))
    texto = new TextDecoder('latin1').decode(buffer)
  const linhasTexto = texto.replace(/^﻿/, '').split(/\r?\n/)
  const sep = linhasTexto[0].includes(';') ? ';' : ','
  const cabecalho = parseLinhaCsv(linhasTexto[0], sep).map((c) => c.trim())
  const linhas = []
  for (let i = 1; i < linhasTexto.length; i++) {
    if (!linhasTexto[i].includes('B1')) continue
    const campos = parseLinhaCsv(linhasTexto[i], sep)
    const linha = Object.fromEntries(cabecalho.map((c, j) => [c, campos[j]]))
    if (linhaResidencialB1(linha)) linhas.push(linha)
  }
  return linhas
}

const main = async () => {
  let linhas = []
  try {
    linhas = await buscarViaApi()
    console.log(`API ANEEL: ${linhas.length} linhas B1 convencional`)
  } catch (erro) {
    console.warn(`API ANEEL indisponível (${erro.message}); tentando CSV...`)
  }
  if (!linhas.some(linhaResidencialB1)) {
    linhas = await buscarViaCsv()
    console.log(`CSV ANEEL: ${linhas.length} linhas residenciais B1`)
  }

  const vigentes = tarifasVigentes(linhas, hoje)
  const dados = JSON.parse(await readFile(ARQUIVO, 'utf8'))
  const resumo = aplicarTarifas(dados, vigentes, hoje)

  console.log(
    `Atualizadas (${resumo.atualizadas.length}): ${resumo.atualizadas.join(', ')}`,
  )
  if (resumo.semMapeamento.length)
    console.log(
      `Sem mapeamento (adicione em scripts/tarifas-aneel.mjs): ${resumo.semMapeamento.join(', ')}`,
    )
  if (resumo.foraDoIntervalo.length)
    console.warn(
      `Ignoradas por valor fora do esperado: ${resumo.foraDoIntervalo.join(', ')}`,
    )
  const pendentes = dados.distribuidoras
    .filter((d) => d.origem !== 'aneel')
    .map((d) => d.id)
  if (pendentes.length)
    console.log(`Sem tarifa ANEEL vigente: ${pendentes.join(', ')}`)

  if (resumo.atualizadas.length < MINIMO_ATUALIZADAS) {
    throw new Error(
      `Apenas ${resumo.atualizadas.length} distribuidoras atualizadas; o formato dos dados pode ter mudado. JSON mantido.`,
    )
  }
  await writeFile(ARQUIVO, JSON.stringify(dados, null, 2) + '\n')
  console.log(`Gravado ${ARQUIVO.pathname}`)
}

main().catch((erro) => {
  console.error(erro.message)
  process.exit(opcional ? 0 : 1)
})
