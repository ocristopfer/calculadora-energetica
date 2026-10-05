// Funções para extrair a tarifa residencial B1 (TE + TUSD) vigente de cada
// distribuidora a partir do conjunto de dados abertos da ANEEL
// "Tarifas de aplicação das distribuidoras de energia elétrica".

export const RESOURCE_ID = 'fcf2906c-7c32-4b9b-a637-054e7a5234f4'
export const API_URL =
  'https://dadosabertos.aneel.gov.br/api/3/action/datastore_search'
export const CSV_URL =
  'https://dadosabertos.aneel.gov.br/dataset/5a583f3e-1646-4f67-bf0f-69db4203e89e/resource/' +
  `${RESOURCE_ID}/download/tarifas-homologadas-distribuidoras-energia-eletrica.csv`

/** Remove acentos, espaços e símbolos e coloca em maiúsculas */
export const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')

// SigAgente (normalizado) -> id em src/data/tarifas.json.
// A ordem importa: o primeiro padrão que casar vence.
export const MAPA_AGENTES = [
  [/^LIGHT/, 'light'],
  [/ENELRJ|^AMPLA/, 'enel-rj'],
  [/ENELSP|ELETROPAULO/, 'enel-sp'],
  [/ENELCE|COELCE/, 'enel-ce'],
  [/ENELGO|CELGD|EQUATORIALGO/, 'equatorial-go'],
  [/PIRATINING/, 'cpfl-piratininga'],
  [/SANTACRUZ/, 'cpfl-santa-cruz'],
  [/CPFLPAULISTA|^CPFL$/, 'cpfl-paulista'],
  [/^COPEL/, 'copel'],
  [/^COCEL/, 'cocel'],
  [/^CEMIG/, 'cemig'],
  [/^RGE/, 'rge'],
  [/^CEEE/, 'ceee'],
  [/^CELESC/, 'celesc'],
  [/EFLJC|JOAOCESA/, 'efljc'],
  [/^COELBA/, 'coelba'],
  [/^CELPE|NEOENERGIAPE/, 'celpe'],
  [/^COSERN/, 'cosern'],
  [/^ELEKTRO/, 'elektro'],
  [/EDPSP|BANDEIRANTE/, 'edp-sp'],
  [/EDPES|ESCELSA/, 'edp-es'],
  [/^CEB|NEOENERGIABRASILIA|NEOENERGIADF/, 'neoenergia-df'],
  [/EQUATORIALPA|^CELPA/, 'equatorial-pa'],
  [/EQUATORIALMA|^CEMAR/, 'equatorial-ma'],
  [/EQUATORIALPI|^CEPISA/, 'equatorial-pi'],
  [/EQUATORIALAL|^CEAL/, 'equatorial-al'],
  [/^CEA/, 'cea'],
  [/^EMT$|ENERGISAMT/, 'energisa-mt'],
  [/^EMS$|ENERGISAMS/, 'energisa-ms'],
  [/^ETO$|ENERGISATO/, 'energisa-to'],
  [/^EPB$|ENERGISAPB/, 'energisa-pb'],
  [/^ESE$|ENERGISASE/, 'energisa-se'],
  [/^ERO$|ENERGISARO|^CERON/, 'energisa-ro'],
  [/^EAC$|ENERGISAAC|ELETROACRE/, 'energisa-ac'],
  [/^EMR$|ENERGISAMR|ENERGISAMINASRIO/, 'energisa-mr'],
  [/^ESS$|ENERGISASS|ENERGISASULSUDESTE/, 'energisa-ss'],
  [/^AME$|AMAZONAS/, 'amazonas-energia'],
  [/RORAIMA|^BOAVISTA|AMBARENERGIARR/, 'roraima-energia'],
  [/SULGIPE/, 'sulgipe'],
  [/^DMED/, 'dmed'],
]

export const idDoAgente = (sigAgente) => {
  const sig = normalizar(sigAgente)
  return MAPA_AGENTES.find(([padrao]) => padrao.test(sig))?.[1]
}

/** Aceita "330,52", "330.52" e números */
export const paraNumero = (valor) => {
  if (typeof valor === 'number') return valor
  const texto = String(valor ?? '').trim()
  if (!texto) return NaN
  const semMilhar = texto.includes(',')
    ? texto.replace(/\./g, '').replace(',', '.')
    : texto
  return Number(semMilhar)
}

/** Aceita "2026-06-24", "2026-06-24T00:00:00" e "24/06/2026" -> "2026-06-24" */
export const paraData = (valor) => {
  const texto = String(valor ?? '').trim()
  const br = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (br) return `${br[3]}-${br[2]}-${br[1]}`
  const iso = texto.match(/^(\d{4}-\d{2}-\d{2})/)
  return iso ? iso[1] : ''
}

const NAO_SE_APLICA = ['', 'NAOSEAPLICA', 'NA']

/** A linha é a tarifa de aplicação residencial B1 convencional? */
export const linhaResidencialB1 = (linha) =>
  normalizar(linha.DscSubGrupo) === 'B1' &&
  normalizar(linha.DscModalidadeTarifaria) === 'CONVENCIONAL' &&
  normalizar(linha.DscClasse) === 'RESIDENCIAL' &&
  normalizar(linha.DscSubClasse) === 'RESIDENCIAL' &&
  normalizar(linha.DscBaseTarifaria).includes('APLICACAO') &&
  NAO_SE_APLICA.includes(normalizar(linha.DscDetalhe)) &&
  NAO_SE_APLICA.includes(normalizar(linha.SigAgenteAcessante)) &&
  NAO_SE_APLICA.includes(normalizar(linha.NomPostoTarifario))

/**
 * Escolhe, para cada agente, a tarifa vigente em `hoje` (a de início de
 * vigência mais recente) e converte de R$/MWh para R$/kWh.
 */
export const tarifasVigentes = (linhas, hoje) => {
  const porAgente = new Map()
  for (const linha of linhas) {
    if (!linhaResidencialB1(linha)) continue
    const inicio = paraData(linha.DatInicioVigencia)
    const fim = paraData(linha.DatFimVigencia)
    if (!inicio || inicio > hoje || (fim && fim < hoje)) continue
    const unidade = normalizar(linha.DscUnidadeTerciaria)
    const divisor = unidade === 'KWH' ? 1 : 1000
    const te = paraNumero(linha.VlrTE) / divisor
    const tusd = paraNumero(linha.VlrTUSD) / divisor
    if (!Number.isFinite(te) || !Number.isFinite(tusd)) continue
    const atual = porAgente.get(linha.SigAgente)
    if (!atual || inicio > atual.inicioVigencia) {
      porAgente.set(linha.SigAgente, {
        sigAgente: linha.SigAgente,
        te,
        tusd,
        inicioVigencia: inicio,
        resolucao: String(linha.DscREH ?? '').trim(),
      })
    }
  }
  return [...porAgente.values()]
}

const arredondar = (n, casas = 5) => Math.round(n * 10 ** casas) / 10 ** casas

/** Aplica as tarifas vigentes ao JSON da aplicação; retorna resumo */
export const aplicarTarifas = (dados, vigentes, hoje) => {
  const atualizadas = []
  const semMapeamento = []
  const foraDoIntervalo = []
  for (const v of vigentes) {
    const id = idDoAgente(v.sigAgente)
    const distribuidora = id && dados.distribuidoras.find((d) => d.id === id)
    if (!distribuidora) {
      semMapeamento.push(v.sigAgente)
      continue
    }
    const tarifa = v.te + v.tusd
    // Proteção contra mudança de unidade/colunas no arquivo da ANEEL
    if (tarifa < 0.2 || tarifa > 3) {
      foraDoIntervalo.push(`${v.sigAgente}=${tarifa}`)
      continue
    }
    Object.assign(distribuidora, {
      tarifa: arredondar(tarifa),
      te: arredondar(v.te),
      tusd: arredondar(v.tusd),
      origem: 'aneel',
      inicioVigencia: v.inicioVigencia,
      ...(v.resolucao ? { resolucao: v.resolucao } : {}),
    })
    atualizadas.push(id)
  }
  if (atualizadas.length > 0) dados.atualizadoEm = hoje
  return { atualizadas, semMapeamento, foraDoIntervalo }
}

/** Parser de uma linha CSV com separador `sep` e aspas duplas */
export const parseLinhaCsv = (linha, sep) => {
  const campos = []
  let atual = ''
  let aspas = false
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i]
    if (aspas) {
      if (c === '"' && linha[i + 1] === '"') {
        atual += '"'
        i++
      } else if (c === '"') aspas = false
      else atual += c
    } else if (c === '"') aspas = true
    else if (c === sep) {
      campos.push(atual)
      atual = ''
    } else atual += c
  }
  campos.push(atual)
  return campos
}
