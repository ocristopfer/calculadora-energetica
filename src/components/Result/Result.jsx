import React from "react";
import { Card } from "react-bootstrap";

const Result = ({ medicaoAnterior, medicaoAtual, bandeira, valorKwh }) => {
  let {
    totalKwh,
    valorConsumido,
    valorBandeira,
    valorTaxaIluminacao,
    valorTotal,
  } = 0;

  const calcular = () => {
    totalKwh = medicaoAtual - medicaoAnterior;
    valorConsumido = parseFloat(
      totalKwh * (valorKwh !== 0 ? getValorTarifa() : getValorKwh())
    );
    valorBandeira = parseFloat(getValorBandeira());
    valorTaxaIluminacao = parseFloat(getTaxaIluminacao());
    valorTotal = valorConsumido + valorBandeira + valorTaxaIluminacao;
  };

  const getValorBandeira = () => {
    if (bandeira === 0) {
      return 0;
    } else {
      return (valorConsumido / 100) * bandeira;
    }
  };
  const getValorTarifa = () => {
    let valor = parseFloat(valorKwh);
    console.log(valor, parseFloat((valor * getICMS()) / 100));
    valor = valor + parseFloat((valor * getICMS()) / 100);
    console.log(valor);
    return valor;
  };

  const getICMS = () => {
    if (totalKwh < 50) return 0;
    if (totalKwh >= 51 && totalKwh <= 300) return 18;
    if (totalKwh >= 301 && totalKwh <= 450) return 31;
    if (totalKwh > 450) return 32;
  };

  const getValorKwh = () => {
    if (totalKwh < 50) return 0.83026;
    if (totalKwh >= 51 && totalKwh <= 300) return 1.01252;
    if (totalKwh >= 301 && totalKwh <= 450) return 1.20328;
    if (totalKwh > 450) return 1.22097;
  };

  //Todo: calculo de taxa de iluminação
  const getTaxaIluminacao = () => {
    if (totalKwh < 80) return 0;
    if (totalKwh >= 80 && totalKwh < 100) return 6.55;
    if (totalKwh >= 100 && totalKwh < 150) return 9.94;
    if (totalKwh >= 150 && totalKwh < 300) return 12.9;
    if (totalKwh >= 300 && totalKwh < 500) return 16.75;
    if (totalKwh >= 500 && totalKwh < 750) return 20.75;
    if (totalKwh >= 750 && totalKwh < 1000) return 24.03;
    if (totalKwh >= 100 && totalKwh < 1500) return 26.2;
    if (totalKwh >= 1500) return 28.61;
  };
  calcular();
  return (
    <>
      <Card>
        <Card.Body>
          <div className="d-flex flex-row bd-highlight mb-3 justify-content-center flex-wrap ">
            <div className="d-flex flex-column bd-highlight mb-3">
              <div>
                <span>Total Consumido (Kwh): </span>
                <span>{totalKwh}</span>
              </div>
              <div>
                <span>Valor Consumido: </span>
                <span>R${valorConsumido.toFixed(2)}</span>
              </div>
              <div>
                <span>Valor Total: </span>
                <span>R${valorTotal.toFixed(2)}</span>
              </div>

              <div>
                <span>Bandeira: </span>
                <span>R${valorBandeira.toFixed(2)}</span>
              </div>
              <div>
                <span>Taxa Iluminacao: </span>
                <span>R${valorTaxaIluminacao.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
export default Result;
