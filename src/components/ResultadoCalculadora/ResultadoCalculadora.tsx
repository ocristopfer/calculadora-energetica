import React from "react";
import { Card } from "react-bootstrap";
import { ICalculadora } from "../../interfaces/props/ICalculadora";

const ResultadoCalculadora = ({ objInputs }:any ) => {
  const {
    bandeira,
    valorKwh,
    medicaoAnterior,
    medicaoAtual,
    valorIMCS,
    valorPISPASEP,
    valorCOFINS,
  }:ICalculadora = objInputs;

  let totalKwh = 0,
    valorConsumido = 0,
    valorBandeira = 0,
    valorTaxaIluminacao = 0,
    valorTotal = 0;

  const getValorBandeira = () => {
    if (bandeira === 1) return 1.87;
    if (bandeira === 2) return 3.97;
    if (bandeira === 3) return 9.49;
    if (bandeira === 4) return 14.2;
    return 0
  };

  const getValorTarifa = () => {
    let valor = checkAndReturnValue(valorKwh, 0.8022);
    valor += (valor * checkAndReturnValue(valorIMCS, getICMS())) / 100;
    valor += (valor * checkAndReturnValue(valorPISPASEP, 0.65)) / 100;
    valor += (valor * checkAndReturnValue(valorCOFINS, 3)) / 100;
    return parseFloat(valor);
  };

  const checkAndReturnValue = (value: any, _default: any) => {
    if (value !== 0 && value !== "") return parseFloat(value);
    return _default;
  };

  const getICMS = () => {
    if (totalKwh < 50) return 0;
    if (totalKwh >= 51 && totalKwh <= 300) return 18;
    if (totalKwh >= 301 && totalKwh <= 450) return 31;
    if (totalKwh > 450) return 32;
  };

  /**
   * Retorna a taxa de iluminação do rio de janeiro.
   * @returns
   */
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
    return 0
  };

  totalKwh = medicaoAtual - medicaoAnterior;
  valorConsumido = totalKwh * getValorTarifa();

  if (bandeira !== 0)
    valorBandeira = getValorBandeira() * (totalKwh / 100);

  valorTaxaIluminacao = getTaxaIluminacao();
  valorTotal = valorConsumido + valorBandeira + valorTaxaIluminacao;

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
export default ResultadoCalculadora;
