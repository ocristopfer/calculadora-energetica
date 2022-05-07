import React from "react";
import {
  Container,
  Form,
  Row,
  Card,
  OverlayTrigger,
  Tooltip,
  Col,
  Accordion,
} from "react-bootstrap";
import Parser from "html-react-parser";
import { Result, Alert } from "./../";

class Inputs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bFlExibirResultado: false,
      resultCount: 0,
      medicaoAnterior: 0,
      medicaoAtual: 0,
      valorKwh: 0,
      bandeira: 0,
      valorIMCS: 0,
      valorPISPASEP: 0,
      valorCOFINS: 0,
    };
  }

  handlerChange = (value, nome) => {
    this.setState({ [nome]: value });
  };

  renderFormGroup = (titulo, state, tootlipText) => (
    <Form.Group className="mb-3">
      <Form.Label>{titulo}</Form.Label>
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={this.renderTooltip(tootlipText)}
      >
        <Form.Control
          sm="10"
          type="number"
          placeholder={titulo}
          value={this.state[state]}
          onChange={(e) => this.handlerChange(e.target.value, state)}
        />
      </OverlayTrigger>
    </Form.Group>
  );
  renderTooltip = (msg) => <Tooltip id="button-tooltip">{Parser(msg)}</Tooltip>;

  render() {
    const { resultCount } = this.state;
    const objInputs = this.state;
    return (
      <>
        <Alert
          bFlShowAlert={true}
          variant="warning"
          titulo="Aviso"
          msg="Os valores apresentados não são 100% precisos"
        ></Alert>
        <Container>
          <Form>
            <Card>
              <Card.Body>
                <Row className="mx-0">
                  {this.renderFormGroup(
                    "Medição anterior",
                    "medicaoAnterior",
                    "Quantidade de Khw da ultima medição feita pela concessionária"
                  )}
                  {this.renderFormGroup(
                    "Medição atual",
                    "medicaoAtual",
                    "Quantidade Kwh atual do medidor"
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Bandeira</Form.Label>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 250, hide: 400 }}
                      overlay={this.renderTooltip(
                        "Bandeira de cobrança:  <br/ >Verde: R$0,00 <br/ > Amarela: R$1,87  <br/ >Vermelha 1: R$3,97  <br/ >Vermelha 2: R$9,49  <br/ >Escassez Hídrica: R$14,20"
                      )}
                    >
                      <Form.Select
                        value={this.state.bandeira}
                        onChange={(e) =>
                          this.handlerChange(e.target.value, "bandeira")
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
                            {this.renderFormGroup(
                              "Tarifa sem Tributos (R$)",
                              "valorKwh",
                              "Valor do Kwh"
                            )}
                            {this.renderFormGroup(
                              "Aliquota ICMS (%)",
                              "valorIMCS",
                              "Porcentagem do ICMS"
                            )}
                          </Col>
                          <Col>
                            {this.renderFormGroup(
                              "Aliquota PIS/PASEP (%)",
                              "valorPISPASEP",
                              "Aliquota PIS/PASEP (%)"
                            )}
                            {this.renderFormGroup(
                              "Aliquota COFINS (%)",
                              "valorCOFINS",
                              "Aliquota COFINS (%)"
                            )}
                          </Col>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Row>
              </Card.Body>
            </Card>
            <br />
            <Result key={resultCount} objInputs={objInputs}></Result>
          </Form>
        </Container>
      </>
    );
  }
}
export default Inputs;
