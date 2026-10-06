export type TipoLigacao = 'monofasico' | 'bifasico' | 'trifasico'

/** Custo de disponibilidade (REN ANEEL 1.000/2021): consumo mínimo faturado */
export const CONSUMO_MINIMO: Record<TipoLigacao, number> = {
  monofasico: 30,
  bifasico: 50,
  trifasico: 100,
}

export interface EntradaConta {
  consumoKwh: number
  tipoLigacao: TipoLigacao
  /** TE + TUSD em R$/kWh, sem tributos */
  tarifaKwh: number
  /** Adicional da bandeira em R$ por 100 kWh */
  bandeiraPor100Kwh: number
  /** Alíquotas em % */
  icms: number
  pis: number
  cofins: number
  /** Contribuição de iluminação pública em R$ */
  cosip: number
}

export interface ResultadoConta {
  consumoKwh: number
  kwhFaturado: number
  energiaSemTributos: number
  bandeiraSemTributos: number
  energiaComTributos: number
  bandeiraComTributos: number
  valorIcms: number
  valorPis: number
  valorCofins: number
  cosip: number
  /** Preço final do kWh com tributos e bandeira */
  tarifaFinalKwh: number
  total: number
}

const arredondar = (valor: number) => Math.round(valor * 100) / 100

/**
 * Calcula a conta de energia no padrão das distribuidoras:
 * os tributos são "por dentro", ou seja,
 * valor com tributos = valor sem tributos / (1 - (ICMS + PIS + COFINS)).
 * A COSIP é somada por fora, sem incidência de tributos.
 */
export const calcularConta = (entrada: EntradaConta): ResultadoConta => {
  const consumoKwh = Math.max(0, entrada.consumoKwh)
  const kwhFaturado = Math.max(consumoKwh, CONSUMO_MINIMO[entrada.tipoLigacao])
  const aliquotaTotal = (entrada.icms + entrada.pis + entrada.cofins) / 100
  if (aliquotaTotal >= 1) {
    throw new RangeError('A soma das alíquotas deve ser menor que 100%')
  }
  const fator = 1 - aliquotaTotal

  const energiaSemTributos = kwhFaturado * entrada.tarifaKwh
  const bandeiraSemTributos = kwhFaturado * (entrada.bandeiraPor100Kwh / 100)

  const energiaComTributos = energiaSemTributos / fator
  const bandeiraComTributos = bandeiraSemTributos / fator
  const baseTributos = energiaComTributos + bandeiraComTributos

  const valorIcms = baseTributos * (entrada.icms / 100)
  const valorPis = baseTributos * (entrada.pis / 100)
  const valorCofins = baseTributos * (entrada.cofins / 100)

  return {
    consumoKwh,
    kwhFaturado,
    energiaSemTributos: arredondar(energiaSemTributos),
    bandeiraSemTributos: arredondar(bandeiraSemTributos),
    energiaComTributos: arredondar(energiaComTributos),
    bandeiraComTributos: arredondar(bandeiraComTributos),
    valorIcms: arredondar(valorIcms),
    valorPis: arredondar(valorPis),
    valorCofins: arredondar(valorCofins),
    cosip: arredondar(entrada.cosip),
    tarifaFinalKwh:
      (entrada.tarifaKwh + entrada.bandeiraPor100Kwh / 100) / fator,
    total: arredondar(baseTributos + entrada.cosip),
  }
}
