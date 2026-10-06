import dados from './tarifas.json'

export type Bandeira = 'verde' | 'amarela' | 'vermelha1' | 'vermelha2'

export interface Distribuidora {
  id: string
  nome: string
  ufs: string[]
  /** TE + TUSD em R$/kWh, sem tributos (B1 residencial convencional) */
  tarifa: number
  te?: number
  tusd?: number
  /** referencia/estimativa = valor manual; aneel = obtido dos dados abertos */
  origem: 'aneel' | 'referencia' | 'estimativa'
  inicioVigencia?: string
  resolucao?: string
}

export const TARIFAS_ATUALIZADAS_EM: string = dados.atualizadoEm
export const FONTE_TARIFAS: string = dados.fonte

/** Valores adicionais das bandeiras em R$ por 100 kWh */
export const BANDEIRAS: Record<Bandeira, number> = dados.bandeiras

export const NOMES_BANDEIRAS: Record<Bandeira, string> = {
  verde: 'Verde',
  amarela: 'Amarela',
  vermelha1: 'Vermelha - Patamar 1',
  vermelha2: 'Vermelha - Patamar 2',
}

export const DISTRIBUIDORAS = dados.distribuidoras as Distribuidora[]

/** Distribuidoras que atendem o estado; as sediadas nele vêm primeiro */
export const distribuidorasDoEstado = (uf: string) => {
  const doEstado = DISTRIBUIDORAS.filter((d) => d.ufs.includes(uf))
  return [
    ...doEstado.filter((d) => d.ufs[0] === uf),
    ...doEstado.filter((d) => d.ufs[0] !== uf),
  ]
}

export const getDistribuidora = (id: string) =>
  DISTRIBUIDORAS.find((d) => d.id === id)
