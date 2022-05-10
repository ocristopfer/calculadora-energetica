import AlertCustom from 'components/AlertCustom'
import ResultadoCalculadora from 'feature/ResultadoCalculadora'
import { namespaces } from 'i18n/i18n.constants'
import { useState } from 'react'
import {
  Form,
  OverlayTrigger,
  Tooltip,
  Card,
  Row,
  Accordion,
  Col,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { ICalculadora } from 'types'
import Parser from 'html-react-parser'
import styles from './Calculadora.module.css'

const Calculadora = () => {
  const { t } = useTranslation(namespaces.components.caluladora)
  const props: ICalculadora = {
    medicaoAnterior: 0,
    medicaoAtual: 0,
    valorKwh: 0,
    bandeira: 0,
    valorIMCS: 0,
    valorPISPASEP: 0,
    valorCOFINS: 0,
    valorTaxaDeIluminacao: 0,
  }
  const [calcState, setCalcState] = useState(props)
  const handlerChange = (value: any, propetyName: any) => {
    setCalcState({
      ...calcState,
      [propetyName]: Number.isNaN(value) ? '' : value,
    })
  }

  const renderFormGroup = (
    titulo: string,
    propetyStateName: string,
    tooltipText: string,
  ) => (
    <Form.Group className={styles.minWidth}>
      <Form.Label>{titulo}</Form.Label>
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip(tooltipText)}
      >
        <Form.Control
          type="number"
          placeholder={titulo}
          value={(calcState as any)[propetyStateName]}
          onChange={(e) =>
            handlerChange(parseFloat(e.target.value), propetyStateName)
          }
          min={0}
        />
      </OverlayTrigger>
    </Form.Group>
  )

  const renderTooltip = (tooltipText: string) => (
    <Tooltip id="button-tooltip">{Parser(tooltipText)}</Tooltip>
  )
  return (
    <>
      <AlertCustom
        isVisible={true}
        variant="warning"
        titulo="Aviso"
        message="Os valores apresentados não são 100% precisos <p>Obs: Usados cálculos base da light"
      ></AlertCustom>
      <Form className="mt-3">
        <Card>
          <Card.Header>Calculadora</Card.Header>
          <Card.Body>
            <Row className="mx-0">
              {renderFormGroup(
                'Medição anterior',
                'medicaoAnterior',
                'Quantidade de Khw da ultima medição feita pela concessionária',
              )}
              {renderFormGroup(
                'Medição atual',
                'medicaoAtual',
                'Quantidade Kwh atual do medidor',
              )}

              <Form.Group className="mb-3">
                <Form.Label>Bandeira</Form.Label>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip(
                    'Bandeira de cobrança:  <br/ >Verde: R$0,00 <br/ > Amarela: R$1,87  <br/ >Vermelha 1: R$3,97  <br/ >Vermelha 2: R$9,49  <br/ >Escassez Hídrica: R$14,20',
                  )}
                >
                  <Form.Select
                    value={calcState.bandeira}
                    onChange={(e) =>
                      handlerChange(parseInt(e.target.value), 'bandeira')
                    }
                  >
                    <option value="0">Verde</option>
                    <option value="1">Amarela</option>
                    <option value="2">Vermelha 1</option>
                    <option value="3">Vermelha 2</option>
                    <option value="4">Escassez Hídrica</option>
                  </Form.Select>
                </OverlayTrigger>
              </Form.Group>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    Opcional (base dos cálculos)
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col className={styles.minWidth}>
                        {renderFormGroup(
                          'Tarifa sem Tributos (R$)',
                          'valorKwh',
                          'Valor do Kwh',
                        )}
                        {renderFormGroup(
                          'Aliquota ICMS (%)',
                          'valorIMCS',
                          'Porcentagem do ICMS',
                        )}
                      </Col>
                      <Col className={styles.minWidth}>
                        {renderFormGroup(
                          'Aliquota PIS/PASEP (%)',
                          'valorPISPASEP',
                          'Aliquota PIS/PASEP (%)',
                        )}
                        {renderFormGroup(
                          'Aliquota COFINS (%)',
                          'valorCOFINS',
                          'Aliquota COFINS (%)',
                        )}
                      </Col>
                      <Col className={styles.minWidth}>
                        {renderFormGroup(
                          'Taxa de Iluminação (R$)',
                          'valorTaxaDeIluminacao',
                          'Taxa de Iluminação (R$)',
                        )}
                        {/* {renderFormGroup(
                          'Juros',
                          'valorJuros',
                          'Aliquota COFINS (%)',
                        )} */}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Row>
          </Card.Body>
        </Card>
        <ResultadoCalculadora objCalculadora={calcState}></ResultadoCalculadora>
      </Form>
    </>
  )
}

export default Calculadora
