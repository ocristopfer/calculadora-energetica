import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  Badge,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap'
import { AlertCustom } from '../../components'
import { ResultadoCalculadora } from '..'
import {
  calcularConta,
  CONSUMO_MINIMO,
  TipoLigacao,
} from '../../calculo/calcularConta'
import { aliquotaIcms, ESTADOS, getEstado } from '../../data/estados'
import { municipiosDoEstado, valorCosip } from '../../data/municipios'
import {
  Bandeira,
  BANDEIRAS,
  distribuidorasDoEstado,
  NOMES_BANDEIRAS,
  TARIFAS_ATUALIZADAS_EM,
} from '../../data/distribuidoras'
import styles from './Calculadora.module.css'

const PIS_PADRAO = 1
const COFINS_PADRAO = 4.6
const CHAVE_STORAGE = 'calculadora-energetica:selecao'

interface Selecao {
  uf: string
  distribuidoraId: string
  municipioId: string
  tipoLigacao: TipoLigacao
  bandeira: Bandeira
}

const SELECAO_PADRAO: Selecao = {
  uf: 'RJ',
  distribuidoraId: 'light',
  municipioId: 'rio-de-janeiro',
  tipoLigacao: 'bifasico',
  bandeira: 'verde',
}

const carregarSelecao = (): Selecao => {
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE)
    if (salvo) return { ...SELECAO_PADRAO, ...JSON.parse(salvo) }
  } catch {
    // storage indisponível: usa o padrão
  }
  return SELECAO_PADRAO
}

/** Converte texto digitado (aceita vírgula) em número; vazio = undefined */
const numero = (valor: string) => {
  if (valor.trim() === '') return undefined
  const n = Number(valor.replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}

const formatarData = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR')

const Calculadora = () => {
  const [selecao, setSelecao] = useState<Selecao>(carregarSelecao)
  const [leituraAnterior, setLeituraAnterior] = useState('')
  const [leituraAtual, setLeituraAtual] = useState('')
  const [tarifaManual, setTarifaManual] = useState('')
  const [icmsManual, setIcmsManual] = useState('')
  const [pisManual, setPisManual] = useState('')
  const [cofinsManual, setCofinsManual] = useState('')
  const [cosipManual, setCosipManual] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(selecao))
    } catch {
      // ignora
    }
  }, [selecao])

  const estado = getEstado(selecao.uf) ?? ESTADOS[0]
  const distribuidoras = distribuidorasDoEstado(estado.uf)
  const distribuidora =
    distribuidoras.find((d) => d.id === selecao.distribuidoraId) ??
    distribuidoras[0]
  const municipios = municipiosDoEstado(estado.uf)
  const municipio = municipios.find((m) => m.id === selecao.municipioId)

  const consumoKwh = Math.max(
    0,
    (numero(leituraAtual) ?? 0) - (numero(leituraAnterior) ?? 0),
  )
  const kwhFaturado = Math.max(consumoKwh, CONSUMO_MINIMO[selecao.tipoLigacao])

  const icmsAuto = aliquotaIcms(estado, kwhFaturado)
  const cosipAuto = municipio ? valorCosip(municipio, consumoKwh) : 0

  const entrada = {
    consumoKwh,
    tipoLigacao: selecao.tipoLigacao,
    tarifaKwh: numero(tarifaManual) ?? distribuidora.tarifa,
    bandeiraPor100Kwh: BANDEIRAS[selecao.bandeira],
    icms: numero(icmsManual) ?? icmsAuto,
    pis: numero(pisManual) ?? PIS_PADRAO,
    cofins: numero(cofinsManual) ?? COFINS_PADRAO,
    cosip: numero(cosipManual) ?? cosipAuto,
  }

  const resultado = useMemo(() => {
    try {
      return calcularConta(entrada)
    } catch {
      return undefined
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(entrada)])

  const alterarSelecao = (parcial: Partial<Selecao>) =>
    setSelecao((atual) => ({ ...atual, ...parcial }))

  const alterarUf = (uf: string) => {
    const primeiraDistribuidora = distribuidorasDoEstado(uf)[0]
    alterarSelecao({
      uf,
      distribuidoraId: primeiraDistribuidora?.id ?? '',
      municipioId: municipiosDoEstado(uf)[0]?.id ?? '',
    })
  }

  const campoNumero = (
    rotulo: string,
    valor: string,
    setValor: (v: string) => void,
    opcoes: {
      placeholder?: string
      prefixo?: string
      sufixo?: string
      ajuda?: string
    } = {},
  ) => (
    <Form.Group className="mb-3">
      <Form.Label>{rotulo}</Form.Label>
      <InputGroup>
        {opcoes.prefixo && <InputGroup.Text>{opcoes.prefixo}</InputGroup.Text>}
        <Form.Control
          inputMode="decimal"
          placeholder={opcoes.placeholder}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        {opcoes.sufixo && <InputGroup.Text>{opcoes.sufixo}</InputGroup.Text>}
      </InputGroup>
      {opcoes.ajuda && <Form.Text muted>{opcoes.ajuda}</Form.Text>}
    </Form.Group>
  )

  const formatarNumero = (n: number, casas = 2) =>
    n.toLocaleString('pt-BR', {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas,
    })

  return (
    <>
      <AlertCustom isVisible variant="warning" titulo="Aviso">
        Os valores são uma estimativa. Tarifas ANEEL (TE + TUSD, residencial B1)
        atualizadas em {formatarData(TARIFAS_ATUALIZADAS_EM)}; ICMS, PIS/COFINS
        e iluminação pública podem variar — confira na sua conta e ajuste em{' '}
        <em>Opcional</em>.
      </AlertCustom>
      <Form className="mt-3" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <Card.Header>Calculadora</Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={estado.uf}
                    onChange={(e) => alterarUf(e.target.value)}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.uf} value={e.uf}>
                        {e.nome} ({e.uf})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Distribuidora</Form.Label>
                  <Form.Select
                    value={distribuidora.id}
                    onChange={(e) =>
                      alterarSelecao({ distribuidoraId: e.target.value })
                    }
                  >
                    {distribuidoras.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nome}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text muted>
                    Tarifa: R$ {formatarNumero(distribuidora.tarifa, 4)}/kWh sem
                    tributos{' '}
                    {distribuidora.origem === 'estimativa' ? (
                      <Badge bg="warning" text="dark">
                        estimada
                      </Badge>
                    ) : distribuidora.origem === 'aneel' ? (
                      <Badge bg="success">ANEEL</Badge>
                    ) : null}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cidade (iluminação pública)</Form.Label>
                  <Form.Select
                    value={municipio?.id ?? ''}
                    onChange={(e) =>
                      alterarSelecao({ municipioId: e.target.value })
                    }
                  >
                    {municipios.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome}
                      </option>
                    ))}
                    <option value="">Outra cidade (informar valor)</option>
                  </Form.Select>
                  <Form.Text muted>
                    {municipio
                      ? municipio.referencia
                      : 'Informe a COSIP/CIP da sua conta em Opcional'}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={3}>
                {campoNumero(
                  'Leitura anterior',
                  leituraAnterior,
                  setLeituraAnterior,
                  {
                    sufixo: 'kWh',
                    ajuda: 'Última leitura feita pela distribuidora',
                  },
                )}
              </Col>
              <Col sm={6} md={3}>
                {campoNumero('Leitura atual', leituraAtual, setLeituraAtual, {
                  sufixo: 'kWh',
                  ajuda: 'Valor atual do medidor',
                })}
              </Col>
              <Col sm={6} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de ligação</Form.Label>
                  <Form.Select
                    value={selecao.tipoLigacao}
                    onChange={(e) =>
                      alterarSelecao({
                        tipoLigacao: e.target.value as TipoLigacao,
                      })
                    }
                  >
                    <option value="monofasico">Monofásico (mín. 30 kWh)</option>
                    <option value="bifasico">Bifásico (mín. 50 kWh)</option>
                    <option value="trifasico">Trifásico (mín. 100 kWh)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Bandeira</Form.Label>
                  <Form.Select
                    value={selecao.bandeira}
                    onChange={(e) =>
                      alterarSelecao({ bandeira: e.target.value as Bandeira })
                    }
                  >
                    {(Object.keys(BANDEIRAS) as Bandeira[]).map((b) => (
                      <option key={b} value={b}>
                        {NOMES_BANDEIRAS[b]}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text muted>
                    {BANDEIRAS[selecao.bandeira] > 0
                      ? `+ R$ ${formatarNumero(BANDEIRAS[selecao.bandeira], 3)} a cada 100 kWh`
                      : 'Sem acréscimo'}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Opcional (ajustar com os valores da sua conta)
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col className={styles.minWidth}>
                      {campoNumero(
                        'Tarifa sem tributos',
                        tarifaManual,
                        setTarifaManual,
                        {
                          prefixo: 'R$',
                          sufixo: '/kWh',
                          placeholder: formatarNumero(distribuidora.tarifa, 4),
                          ajuda: 'TE + TUSD',
                        },
                      )}
                    </Col>
                    <Col className={styles.minWidth}>
                      {campoNumero('ICMS', icmsManual, setIcmsManual, {
                        sufixo: '%',
                        placeholder: formatarNumero(icmsAuto, 1),
                        ajuda: `Padrão ${estado.uf}`,
                      })}
                    </Col>
                    <Col className={styles.minWidth}>
                      {campoNumero('PIS/PASEP', pisManual, setPisManual, {
                        sufixo: '%',
                        placeholder: formatarNumero(PIS_PADRAO, 2),
                        ajuda: 'Varia mês a mês',
                      })}
                    </Col>
                    <Col className={styles.minWidth}>
                      {campoNumero('COFINS', cofinsManual, setCofinsManual, {
                        sufixo: '%',
                        placeholder: formatarNumero(COFINS_PADRAO, 2),
                        ajuda: 'Varia mês a mês',
                      })}
                    </Col>
                    <Col className={styles.minWidth}>
                      {campoNumero(
                        'Iluminação pública',
                        cosipManual,
                        setCosipManual,
                        {
                          prefixo: 'R$',
                          placeholder: formatarNumero(cosipAuto, 2),
                          ajuda: 'COSIP/CIP',
                        },
                      )}
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Card.Body>
        </Card>
        {resultado ? (
          <ResultadoCalculadora resultado={resultado} />
        ) : (
          <AlertCustom isVisible titulo="Valores inválidos">
            A soma das alíquotas de ICMS, PIS e COFINS deve ser menor que 100%.
          </AlertCustom>
        )}
      </Form>
    </>
  )
}

export default Calculadora
