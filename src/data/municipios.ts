// Contribuição de Iluminação Pública (COSIP/CIP) é definida por cada
// município. Cidades sem tabela cadastrada usam o valor informado na tela.

export interface FaixaCosip {
  /** Consumo mínimo (kWh, inclusive) da faixa */
  deKwh: number
  valor: number
}

export interface Municipio {
  id: string
  nome: string
  uf: string
  /** Fonte/ano de referência da tabela */
  referencia: string
  faixasCosip: FaixaCosip[]
}

export const MUNICIPIOS: Municipio[] = [
  {
    id: 'rio-de-janeiro',
    nome: 'Rio de Janeiro',
    uf: 'RJ',
    referencia: 'Tabela COSIP Light (2022)',
    faixasCosip: [
      { deKwh: 0, valor: 0 },
      { deKwh: 80, valor: 6.55 },
      { deKwh: 100, valor: 9.94 },
      { deKwh: 150, valor: 12.9 },
      { deKwh: 300, valor: 16.75 },
      { deKwh: 500, valor: 20.75 },
      { deKwh: 750, valor: 24.03 },
      { deKwh: 1000, valor: 26.2 },
      { deKwh: 1500, valor: 28.61 },
    ],
  },
]

export const municipiosDoEstado = (uf: string) =>
  MUNICIPIOS.filter((m) => m.uf === uf)

export const valorCosip = (municipio: Municipio, consumoKwh: number) => {
  let valor = 0
  for (const faixa of municipio.faixasCosip) {
    if (consumoKwh >= faixa.deKwh) valor = faixa.valor
  }
  return valor
}
