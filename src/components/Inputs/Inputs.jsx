import React from "react";
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
        <span>
          Todo: Necessário adicionar caculo para taxa de iluminação public
          <br />
          Todo: Melhorar o layout que ta feio
          <br />
          Todo: Verificar calculo
        </span>
        <div className={styles.card}>
          <div className={styles.inputs}>
            <span>Medição Anterior:</span>
            <input
              type="text"
              name="name"
              value={this.state.medicaoAnterior}
              onChange={this.handleChangeMedicaoAnterior}
            />
            <span>Medição Atual: </span>
            <input
              type="text"
              name="name"
              value={this.state.medicaoAtual}
              onChange={this.handleChangeMedicaoAtual}
            />
            <span>Valor do Kwh: </span>
            <input
              type="text"
              name="name"
              value={this.state.valorKwh}
              onChange={this.handleChangeValorKwh}
            />
            <span>Bandeira:</span>
            <select
              name="bandeiras"
              id="bandeiras"
              value={this.state.bandeira}
              onChange={this.handleChangeBandeira}
            >
              <option value="0">Verde</option>
              <option value="1.87">Amarela</option>
              <option value="3.97">Vermelha 1</option>
              <option value="9.49">Vermelha 2</option>
            </select>
            <span>Bandeira Escassez Hídrica:</span>
            <input
              type="checkbox"
              value={this.state.bFlEscassezHidrica}
              onChange={this.handleChangeEcassezHidrica}
            ></input>
            <button className={styles.btnCacular} onClick={this.calcular}>
              Calcular
            </button>
          </div>

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
