import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import styles from "./Inputs.module.css";
import Result from "./../Result";
console.log(styles);
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
    this.handleChangeMedicaoAnterior =
      this.handleChangeMedicaoAnterior.bind(this);
    this.handleChangeValorKwh = this.handleChangeValorKwh.bind(this);
    this.handleChangeMedicaoAtual = this.handleChangeMedicaoAtual.bind(this);
    this.handleChangeBandeira = this.handleChangeBandeira.bind(this);
    this.handleChangeEcassezHidrica =
      this.handleChangeEcassezHidrica.bind(this);
  }

  calcular = () => {
    if (this.state.medicaoAtual === 0) {
      alert("Necessário informar a medição atual");
      return;
    }
    const resultCont = this.state.resultCount;
    this.setState({
      bFlExibirResultado: true,
      resultCount: resultCont + 1,
    });
  };

  handleChangeMedicaoAnterior(event) {
    this.setState({ medicaoAnterior: event.target.value });
  }
  handleChangeMedicaoAtual(event) {
    this.setState({ medicaoAtual: event.target.value });
  }

  handleChangeValorKwh(event) {
    this.setState({ valorKwh: event.target.value });
  }
  handleChangeBandeira(event) {
    this.setState({ bandeira: event.target.value });
  }

  handleChangeEcassezHidrica(event) {
    this.setState({ bFlEscassezHidrica: event.target.checked });
  }

  render() {
    const {
      bFlExibirResultado,
      resultCount,
      medicaoAnterior,
      medicaoAtual,
      valorKwh,
      bFlEscassezHidrica,
      bandeira,
    } = this.state;
    return (
      <div className={styles.component}>
        <Form>
          <Row className="mx-0">
            <Form.Group className="mb-3" as={Col}>
              <Form.Label>Medição anterior</Form.Label>
              <Form.Control
                sm="10"
                type="number"
                placeholder="Medição anterior"
                value={this.state.medicaoAnterior}
                onChange={this.handleChangeMedicaoAnterior}
              />
            </Form.Group>

            <Form.Group className="mb-3" as={Col}>
              <Form.Label>Medição atual</Form.Label>
              <Form.Control
                type="number"
                placeholder="Medição atual"
                value={this.state.medicaoAtual}
                onChange={this.handleChangeMedicaoAtual}
              />
            </Form.Group>
          </Row>
          <Row className="mx-0">
            <Form.Group className="mb-3" as={Col}>
              <Form.Label>Valor do Kwh:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Valor do Kwh"
                value={this.state.valorKwh}
                onChange={this.handleChangeValorKwh}
              />
            </Form.Group>

            <Form.Group className="mb-3" as={Col}>
              <Form.Label>Bandeira</Form.Label>
              <Form.Select
                value={this.state.bandeira}
                onChange={this.handleChangeBandeira}
              >
                <option value="0">Verde</option>
                <option value="1.87">Amarela</option>
                <option value="3.97">Vermelha 1</option>
                <option value="9.49">Vermelha 2</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row className="mx-0">
            <Form.Group className="mb-3" as={Col}>
              <Form.Check
                type="checkbox"
                label="Bandeira escassez hídrica"
                value={this.state.bFlEscassezHidrica}
                onChange={this.handleChangeEcassezHidrica}
              />
            </Form.Group>
          </Row>
          <Button variant="primary" onClick={this.calcular}>
            Calcular
          </Button>
        </Form>

        <div className={styles.card}>
          {bFlExibirResultado ? (
            <div className={styles.result}>
              <Result
                key={resultCount}
                medicaoAnterior={medicaoAnterior}
                medicaoAtual={medicaoAtual}
                valorKwh={valorKwh}
                bFlEscassezHidrica={bFlEscassezHidrica}
                bandeira={bandeira}
              ></Result>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
export default Inputs;
