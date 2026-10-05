import { describe, expect, it } from 'vitest'
import {
  aplicarTarifas,
  idDoAgente,
  paraData,
  paraNumero,
  parseLinhaCsv,
  tarifasVigentes,
} from './tarifas-aneel.mjs'

const linha = (extra) => ({
  DscREH: 'REH 1.000/2026',
  SigAgente: 'LIGHT SESA',
  DatInicioVigencia: '2026-03-15',
  DatFimVigencia: '2027-03-14',
  DscBaseTarifaria: 'Tarifa de Aplicação',
  DscSubGrupo: 'B1',
  DscModalidadeTarifaria: 'Convencional',
  DscClasse: 'Residencial',
  DscSubClasse: 'Residencial',
  DscDetalhe: 'Não se aplica',
  NomPostoTarifario: 'Não se aplica',
  DscUnidadeTerciaria: 'MWh',
  SigAgenteAcessante: 'Não se aplica',
  VlrTUSD: '550,10',
  VlrTE: '331,20',
  ...extra,
})

describe('tarifas ANEEL', () => {
  it('mapeia siglas de agentes', () => {
    expect(idDoAgente('LIGHT SESA')).toBe('light')
    expect(idDoAgente('COPEL-DIS')).toBe('copel')
    expect(idDoAgente('CPFL-PIRATININGA')).toBe('cpfl-piratininga')
    expect(idDoAgente('CPFL-PIRATINING')).toBe('cpfl-piratininga')
    expect(idDoAgente('ÂMBAR ENERGIA RR')).toBe('roraima-energia')
    expect(idDoAgente('CEEE-D')).toBe('ceee')
    expect(idDoAgente('CEA')).toBe('cea')
    expect(idDoAgente('CEAL')).toBe('equatorial-al')
    expect(idDoAgente('EMS')).toBe('energisa-ms')
    expect(idDoAgente('XYZ')).toBeUndefined()
  })

  it('converte números e datas', () => {
    expect(paraNumero('1.234,56')).toBe(1234.56)
    expect(paraNumero('331.2')).toBe(331.2)
    expect(paraData('15/03/2026')).toBe('2026-03-15')
    expect(paraData('2026-03-15T00:00:00')).toBe('2026-03-15')
  })

  it('escolhe a tarifa vigente e converte para R$/kWh', () => {
    const vigentes = tarifasVigentes(
      [
        linha({
          DatInicioVigencia: '2025-03-15',
          DatFimVigencia: '2026-03-14',
          VlrTE: '1',
        }),
        linha({}),
        linha({ DscDetalhe: 'SCEE', VlrTE: '2' }),
        linha({ DscClasse: 'Rural', VlrTE: '3' }),
        linha({
          DatInicioVigencia: '2027-03-15',
          DatFimVigencia: '',
          VlrTE: '4',
        }),
      ],
      '2026-10-05',
    )
    expect(vigentes).toHaveLength(1)
    expect(vigentes[0].te).toBeCloseTo(0.3312)
    expect(vigentes[0].tusd).toBeCloseTo(0.5501)
  })

  it('atualiza o JSON e ignora valores absurdos', () => {
    const dados = {
      atualizadoEm: '2020-01-01',
      distribuidoras: [
        { id: 'light', tarifa: 1, origem: 'estimativa' },
        { id: 'copel', tarifa: 1, origem: 'estimativa' },
      ],
    }
    const resumo = aplicarTarifas(
      dados,
      [
        {
          sigAgente: 'LIGHT SESA',
          te: 0.3312,
          tusd: 0.5501,
          inicioVigencia: '2026-03-15',
          resolucao: 'REH',
        },
        {
          sigAgente: 'COPEL-DIS',
          te: 331,
          tusd: 550,
          inicioVigencia: '2026-06-24',
          resolucao: '',
        },
        {
          sigAgente: 'NOVA',
          te: 0.3,
          tusd: 0.4,
          inicioVigencia: '2026-01-01',
          resolucao: '',
        },
      ],
      '2026-10-05',
    )
    expect(resumo.atualizadas).toEqual(['light'])
    expect(resumo.semMapeamento).toEqual(['NOVA'])
    expect(resumo.foraDoIntervalo).toHaveLength(1)
    expect(dados.distribuidoras[0]).toMatchObject({
      tarifa: 0.8813,
      origem: 'aneel',
    })
    expect(dados.distribuidoras[1].origem).toBe('estimativa')
    expect(dados.atualizadoEm).toBe('2026-10-05')
  })

  it('lê CSV com aspas e separador ;', () => {
    expect(parseLinhaCsv('"a;b";"c ""d""";e', ';')).toEqual([
      'a;b',
      'c "d"',
      'e',
    ])
  })
})
