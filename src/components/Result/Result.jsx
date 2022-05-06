import React from "react";
import styles from "./Result.module.css";
class Result extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.medicaoAnterior = this.props.medicaoAnterior;
    this.medicaoAtual = this.props.medicaoAtual;
    this.bandeira = this.props.bandeira;
    this.bFlEscassezHidrica = this.props.bFlEscassezHidrica;
    this.valorKwh = this.props.valorKwh;
    this.calcular();
  }
  calcular = () => {
    this.totalKwh = this.medicaoAtual - this.medicaoAnterior;
    this.valorConsumido = parseFloat(
      this.totalKwh * (this.valorKwh !== 0 ? this.valorKwh : 1.1)
    );
    this.valorBandeira = parseFloat(this.getValorBandeira());
    this.valorEscassezHidrica = parseFloat(this.getValorEcassezHidrica());
    this.taxaIluminacao = parseFloat(this.getTaxaIluminacao());
    this.valorTotal =
      this.valorConsumido +
      this.valorBandeira +
      this.valorEscassezHidrica +
      this.taxaIluminacao;
  };
  getValorBandeira = () => {
    if (this.bandeira === 0) {
      return 0;
    } else {
      return (this.valorConsumido / 100) * this.bandeira;
    }
  };
  getValorEcassezHidrica = () => {
    if (this.bFlEscassezHidrica) {
      return (this.valorConsumido / 100) * 14.2;
    } else {
      return 0;
    }
  };

  getTaxaIluminacao = () => {
    return 18;
  };
  render() {
    return (
      <div className={styles.card}>
        <div className={styles.results}>
          <span>Total KWH: </span>
          <span>{this.totalKwh}</span>
        </div>
        <div className={styles.results}>
          <span>Valor Consumido: </span>
          <span>R${this.valorConsumido.toFixed(2)}</span>
        </div>
        <div className={styles.results}>
          <span>Bandeira: </span>
          <span>R${this.valorBandeira.toFixed(2)}</span>
        </div>
        <div className={styles.results}>
          <span>Escassez Hidrica: </span>
          <span>R${this.valorEscassezHidrica.toFixed(2)}</span>
        </div>
        <div className={styles.results}>
          <span>Taxa Iluminacao: </span>
          <span>R${this.taxaIluminacao.toFixed(2)}</span>
        </div>
        <div className={styles.results}>
          <span>Valor Total: </span>
          <span>R${this.valorTotal.toFixed(2)}</span>
        </div>
      </div>
    );
  }
}
export default Result;
