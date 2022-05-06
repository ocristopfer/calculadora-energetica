import React from "react";
import { Form, Row, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./Inputs.module.css";
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
      bFlEscassezHidrica: false,
      bandeira: 0,
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
  renderTooltip = (msg) => <Tooltip id="button-tooltip">{msg}</Tooltip>;

  render() {
    const {
      resultCount,
      medicaoAnterior,
      medicaoAtual,
      valorKwh,
      bFlEscassezHidrica,
      bandeira,
    } = this.state;
    return (
      <>
        <Alert
          bFlShowAlert={true}
          variant="warning"
          titulo="Aviso"
          msg="Os valores apresentados não são 100% precisos"
        ></Alert>
        <Form>
          <Card>
            <Card.Body>
              <Row className="mx-0">
                {this.renderFormGroup(
                  "Medição anterior",
                  "medicaoAnterior",
                  "Valor em Kwh da medição anterior feita pela concessionária"
                )}
                {this.renderFormGroup(
                  "Medição atual",
                  "medicaoAtual",
                  "Valor em Kwh da medição atual feita pela concessionária"
                )}
                {this.renderFormGroup(
                  "Valor do Kwh",
                  "valorKwh",
                  "Valor do Kwh"
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Bandeira</Form.Label>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={this.renderTooltip(
                      "Bandeira de cobrança, Verde: 0, Amarela: 1,87, Vermelha 1: 3,97, Vermelha 2: 9,49"
                    )}
                  >
                    <Form.Select
                      value={this.state.bandeira}
                      onChange={(e) =>
                        this.handlerChange(e.target.value, "bandeira")
                      }
                    >
                      <option value="0">Verde</option>
                      <option value="1.87">Amarela</option>
                      <option value="3.97">Vermelha 1</option>
                      <option value="9.49">Vermelha 2</option>
                    </Form.Select>
                  </OverlayTrigger>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Bandeira escassez hídrica"
                    value={this.state.bFlEscassezHidrica}
                    onChange={(e) =>
                      this.handlerChange(e.target.checked, "bFlEscassezHidrica")
                    }
                    className={styles.fixCheckBox}
                  />
                </Form.Group>
              </Row>
            </Card.Body>
          </Card>
          <br />
          <Result
            key={resultCount}
            medicaoAnterior={medicaoAnterior}
            medicaoAtual={medicaoAtual}
            valorKwh={valorKwh}
            bFlEscassezHidrica={bFlEscassezHidrica}
            bandeira={bandeira}
          ></Result>
        </Form>
      </>
    );
  }
}
export default Inputs;
