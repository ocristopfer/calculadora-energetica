import { describe, expect, it } from 'vitest'
import { calcularConta, EntradaConta } from './calcularConta'
import { aliquotaIcms, getEstado, ESTADOS } from '../data/estados'
import { valorCosip, MUNICIPIOS } from '../data/municipios'
import { distribuidorasDoEstado } from '../data/distribuidoras'

const base: EntradaConta = {
  consumoKwh: 200,
  tipoLigacao: 'bifasico',
  tarifaKwh: 0.8,
  bandeiraPor100Kwh: 0,
  icms: 20,
  pis: 1,
  cofins: 4,
  cosip: 0,
}

describe('calcularConta', () => {
  it('aplica tributos por dentro', () => {
    const r = calcularConta(base)
    // 200 * 0,80 = 160 / (1 - 0,25) = 213,33
    expect(r.energiaComTributos).toBe(213.33)
    expect(r.valorIcms).toBe(42.67)
    expect(r.valorPis).toBe(2.13)
    expect(r.valorCofins).toBe(8.53)
    expect(r.total).toBe(213.33)
    // tributos devem somar a diferença entre valor com e sem tributos
    expect(r.valorIcms + r.valorPis + r.valorCofins).toBeCloseTo(
      r.energiaComTributos - r.energiaSemTributos,
      1,
    )
  })

  it('cobra bandeira sobre todo o consumo, proporcional a cada kWh', () => {
    const r = calcularConta({
      ...base,
      consumoKwh: 150,
      bandeiraPor100Kwh: 4.463,
    })
    expect(r.bandeiraSemTributos).toBe(6.69)
    expect(r.bandeiraComTributos).toBe(8.93)
  })

  it('fatura o custo de disponibilidade quando o consumo é baixo', () => {
    const r = calcularConta({
      ...base,
      consumoKwh: 10,
      tipoLigacao: 'trifasico',
    })
    expect(r.consumoKwh).toBe(10)
    expect(r.kwhFaturado).toBe(100)
  })

  it('soma a COSIP sem tributos', () => {
    const r = calcularConta({ ...base, cosip: 16.75 })
    expect(r.total).toBe(230.08)
  })

  it('rejeita alíquotas que somam 100%', () => {
    expect(() =>
      calcularConta({ ...base, icms: 90, pis: 5, cofins: 5 }),
    ).toThrow()
  })
})

describe('dados', () => {
  it('ICMS do RJ é isento até 50 kWh', () => {
    const rj = getEstado('RJ')!
    expect(aliquotaIcms(rj, 50)).toBe(0)
    expect(aliquotaIcms(rj, 51)).toBe(20)
  })

  it('COSIP do Rio segue a tabela por faixa', () => {
    const rio = MUNICIPIOS.find((m) => m.id === 'rio-de-janeiro')!
    expect(valorCosip(rio, 79)).toBe(0)
    expect(valorCosip(rio, 300)).toBe(16.75)
    expect(valorCosip(rio, 1200)).toBe(26.2)
  })

  it('todo estado tem ao menos uma distribuidora', () => {
    for (const { uf } of ESTADOS) {
      expect(distribuidorasDoEstado(uf).length, uf).toBeGreaterThan(0)
    }
  })
})

describe('distribuidorasDoEstado', () => {
  it('lista primeiro a distribuidora sediada no estado', () => {
    expect(distribuidorasDoEstado('PR')[0].id).toBe('copel')
    expect(distribuidorasDoEstado('RJ')[0].id).toBe('light')
    expect(distribuidorasDoEstado('MG')[0].id).toBe('cemig')
  })
})
