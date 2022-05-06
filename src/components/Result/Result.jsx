import React from "react";
import { Card, Col } from "react-bootstrap";

const Result = ({
  medicaoAnterior,
  medicaoAtual,
  bandeira,
  bFlEscassezHidrica,
  valorKwh,
}) => {
  let {
    totalKwh,
    valorConsumido,
    valorBandeira,
    valorEscassezHidrica,
    valorTaxaIluminacao,
    valorTotal,
  } = 0;

  const calcular = () => {
    totalKwh = medicaoAtual - medicaoAnterior;
    valorConsumido = parseFloat(totalKwh * (valorKwh !== 0 ? valorKwh : 1.1));
    valorBandeira = parseFloat(getValorBandeira());
    valorEscassezHidrica = parseFloat(getValorEcassezHidrica());
    valorTaxaIluminacao = parseFloat(getTaxaIluminacao());
    valorTotal =
      valorConsumido +
      valorBandeira +
      valorEscassezHidrica +
      valorTaxaIluminacao;
  };

  const getValorBandeira = () => {
    if (bandeira === 0) {
      return 0;
    } else {
      return (valorConsumido / 100) * bandeira;
    }
  };
  const getValorEcassezHidrica = () => {
    if (bFlEscassezHidrica) {
      return (valorConsumido / 100) * 14.2;
    } else {
      return 0;
    }
  };

  //Todo: calculo de taxa de iluminação
  const getTaxaIluminacao = () => {
    return 18;
  };
  calcular();
  return (
    <>
      <Card>
        <Card.Body>
          <div className="mb-3" as={Col}>
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
          </div>
          <div className="mb-3" as={Col}>
            <div>
              <span>Bandeira: </span>
              <span>R${valorBandeira.toFixed(2)}</span>
            </div>
            <div>
              <span>Escassez Hidrica: </span>
              <span>R${valorEscassezHidrica.toFixed(2)}</span>
            </div>
            <div>
              <span>Taxa Iluminacao: </span>
              <span>R${valorTaxaIluminacao.toFixed(2)}</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};
export default Result;
