// Alíquotas de ICMS sobre energia elétrica residencial por estado.
// Após a LC 194/2022 a energia passou a ser tributada pela alíquota modal
// de cada estado. Alguns estados têm isenção/redução para consumos baixos.
// Os valores são referências e podem ser alterados na tela (campo ICMS).

export interface FaixaIcms {
  /** Consumo máximo (kWh, inclusive) ao qual a alíquota se aplica */
  ateKwh: number
  aliquota: number
}

export interface Estado {
  uf: string
  nome: string
  /** Alíquota padrão (%) */
  icms: number
  /** Faixas de consumo com alíquota diferenciada, em ordem crescente */
  faixasIcms?: FaixaIcms[]
}

export const ESTADOS: Estado[] = [
  { uf: 'AC', nome: 'Acre', icms: 19 },
  { uf: 'AL', nome: 'Alagoas', icms: 20 },
  { uf: 'AM', nome: 'Amazonas', icms: 20 },
  { uf: 'AP', nome: 'Amapá', icms: 18 },
  { uf: 'BA', nome: 'Bahia', icms: 20.5 },
  { uf: 'CE', nome: 'Ceará', icms: 20 },
  { uf: 'DF', nome: 'Distrito Federal', icms: 20 },
  { uf: 'ES', nome: 'Espírito Santo', icms: 17 },
  { uf: 'GO', nome: 'Goiás', icms: 19 },
  { uf: 'MA', nome: 'Maranhão', icms: 23 },
  { uf: 'MG', nome: 'Minas Gerais', icms: 18 },
  { uf: 'MS', nome: 'Mato Grosso do Sul', icms: 17 },
  { uf: 'MT', nome: 'Mato Grosso', icms: 17 },
  { uf: 'PA', nome: 'Pará', icms: 19 },
  { uf: 'PB', nome: 'Paraíba', icms: 20 },
  { uf: 'PE', nome: 'Pernambuco', icms: 20.5 },
  { uf: 'PI', nome: 'Piauí', icms: 22.5 },
  { uf: 'PR', nome: 'Paraná', icms: 19.5 },
  {
    uf: 'RJ',
    nome: 'Rio de Janeiro',
    icms: 20,
    faixasIcms: [{ ateKwh: 50, aliquota: 0 }],
  },
  { uf: 'RN', nome: 'Rio Grande do Norte', icms: 20 },
  { uf: 'RO', nome: 'Rondônia', icms: 19.5 },
  { uf: 'RR', nome: 'Roraima', icms: 20 },
  { uf: 'RS', nome: 'Rio Grande do Sul', icms: 17 },
  {
    uf: 'SC',
    nome: 'Santa Catarina',
    icms: 17,
    faixasIcms: [{ ateKwh: 150, aliquota: 12 }],
  },
  { uf: 'SE', nome: 'Sergipe', icms: 20 },
  { uf: 'SP', nome: 'São Paulo', icms: 18 },
  { uf: 'TO', nome: 'Tocantins', icms: 20 },
]

export const getEstado = (uf: string) => ESTADOS.find((e) => e.uf === uf)

export const aliquotaIcms = (estado: Estado, consumoKwh: number) => {
  const faixa = estado.faixasIcms?.find((f) => consumoKwh <= f.ateKwh)
  return faixa ? faixa.aliquota : estado.icms
}
