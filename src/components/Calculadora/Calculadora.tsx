import { useState } from 'react'
import Parser from 'html-react-parser'
import { ICalculadora } from '../../interfaces/props/ICalculadora'
import {
  Form,
  Row,
  Card,
  OverlayTrigger,
  Tooltip,
  Col,
  Accordion,
} from 'react-bootstrap'
import { ResultadoCalculadora, Alert } from './../'

const Calculadora = () => {
  const props: ICalculadora = {
    bFlExibirResultado: false,
    resultCount: 0,
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
  const handlerChange = (value: any, nome: string) => {
    const name = nome as keyof typeof calcState
    setCalcState({ ...calcState, [name]: value })
  }

  const renderFormGroup = (
    titulo: string,
    state: string,
    tootlipText: string,
  ) => (
    <Form.Group className="mb-3">
      <Form.Label>{titulo}</Form.Label>
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip(tootlipText)}
      >
        <Form.Control
          type="number"
          placeholder={titulo}
          value={(calcState as any)[state]}
          onChange={(e) => handlerChange(parseFloat(e.target.value), state)}
          min={0}
        />
      </OverlayTrigger>
    </Form.Group>
  )

  const renderTooltip = (msg: string) => (
    <Tooltip id="button-tooltip">{Parser(msg)}</Tooltip>
  )
  return (
    <>
      <Alert
        bFlShowAlert={true}
        variant="warning"
        titulo="Aviso"
        msg="Os valores apresentados não são 100% precisos <p>Obs: Usados cálculos base da light"
      ></Alert>
      <Form className="mt-3">
        <Card>
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
                    Opcional (Dados para os cálculos)
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col>
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
                      <Col>
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
                      <Col>
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
