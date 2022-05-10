export interface IRotas {
  key: number
  caminho: string
  nome: string
}

export interface ICalculadora {
  medicaoAnterior: number
  medicaoAtual: number
  valorKwh: number
  bandeira: number
  valorIMCS: number
  valorPISPASEP: number
  valorCOFINS: number
  valorTaxaDeIluminacao: number
}

export interface ICalculadoraResponse {
  quantidadeKwh: number
  valorConsumidoSemTaxa: number
  valorConsumidoComTaxa: number
  valorTotal: number
  valorBandeira: number
  valorTaxaIluminacao: number
  valorICMS: number
  valorPisPasep: number
  valorCOFINS: number
  valorKwComTaxas: number
}
