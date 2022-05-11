import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { ICalculadora, ICalculadoraResponse } from '../../types'
import { Calculadora } from './services'

const ResultadoCalculadora: React.FC<{ objCalculadora: ICalculadora }> = ({
  objCalculadora,
}) => {
  const [data, setData] = useState({} as ICalculadoraResponse)

  useEffect(() => {
    setData(Calculadora(objCalculadora))
  }, [objCalculadora])

  var formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <>
      <Card className="mt-3">
        <Card.Header>Resultado</Card.Header>
        <Card.Body>
          <div className="row d-flex flex-row bd-highlight justify-content-center flex-wrap">
            <div className="d-flex flex-column mt-1 bd-highlight col-lg-6">
              <Card>
                <Card.Header>Totais</Card.Header>
                <Card.Body>
                  <div>
                    <span>Total Consumido (Kwh): </span>
                    <span>{data.quantidadeKwh}</span>
                  </div>
                  <div>
                    <span>Valor Consumido (Sem taxas): </span>
                    <span>{formatter.format(data.valorConsumidoSemTaxa)}</span>
                  </div>
                  <div>
                    <span>Valor Consumido: </span>
                    <span>{formatter.format(data.valorConsumidoComTaxa)}</span>
                  </div>
                  <div>
                    <span>Valor Total: </span>
                    <span>{formatter.format(data.valorTotal)}</span>
                  </div>
                  <div>
                    <span>Taxa Iluminacao: </span>
                    <span>{formatter.format(data.valorTaxaIluminacao)}</span>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="d-flex flex-column mt-1 bd-highlight col-lg-6">
              <Card>
                <Card.Header>Taxas</Card.Header>
                <Card.Body>
                  <div>
                    <span>Valor kw: </span>
                    <span>{formatter.format(data.valorKwComTaxas)}</span>
                  </div>
                  <div>
                    <span>Total IMCS: </span>
                    <span>{formatter.format(data.valorICMS)}</span>
                  </div>
                  <div>
                    <span>Total PIS/PASEP: </span>
                    <span>{formatter.format(data.valorPisPasep)}</span>
                  </div>
                  <div>
                    <span>Total COFINS: </span>
                    <span>{formatter.format(data.valorCOFINS)}</span>
                    <div>
                      <span>Total Bandeira: </span>
                      <span>{formatter.format(data.valorBandeira)}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}
export default ResultadoCalculadora
