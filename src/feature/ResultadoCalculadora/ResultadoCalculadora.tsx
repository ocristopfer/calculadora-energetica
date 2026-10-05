import { Card, Col, Row, Table } from 'react-bootstrap'
import { ResultadoConta } from '../../calculo/calcularConta'

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
const moedaKwh = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
})

const Linha = ({ rotulo, valor }: { rotulo: string; valor: string }) => (
  <tr>
    <td>{rotulo}</td>
    <td className="text-end">{valor}</td>
  </tr>
)

const ResultadoCalculadora = ({ resultado }: { resultado: ResultadoConta }) => (
  <Card className="mt-3 mb-4">
    <Card.Header>Resultado</Card.Header>
    <Card.Body>
      <div className="text-center mb-3">
        <div className="text-muted">Valor estimado da conta</div>
        <div className="display-6 fw-bold">{moeda.format(resultado.total)}</div>
      </div>
      <Row>
        <Col lg={6}>
          <Table size="sm" className="mb-3">
            <thead>
              <tr>
                <th colSpan={2}>Consumo</th>
              </tr>
            </thead>
            <tbody>
              <Linha
                rotulo="Consumo medido"
                valor={`${resultado.consumoKwh} kWh`}
              />
              <Linha
                rotulo="Consumo faturado"
                valor={`${resultado.kwhFaturado} kWh`}
              />
              <Linha
                rotulo="Energia (sem tributos)"
                valor={moeda.format(resultado.energiaSemTributos)}
              />
              <Linha
                rotulo="Energia (com tributos)"
                valor={moeda.format(resultado.energiaComTributos)}
              />
              <Linha
                rotulo="Bandeira (com tributos)"
                valor={moeda.format(resultado.bandeiraComTributos)}
              />
              <Linha
                rotulo="Iluminação pública"
                valor={moeda.format(resultado.cosip)}
              />
            </tbody>
          </Table>
        </Col>
        <Col lg={6}>
          <Table size="sm" className="mb-3">
            <thead>
              <tr>
                <th colSpan={2}>Tributos</th>
              </tr>
            </thead>
            <tbody>
              <Linha
                rotulo="Preço final do kWh"
                valor={moedaKwh.format(resultado.tarifaFinalKwh)}
              />
              <Linha rotulo="ICMS" valor={moeda.format(resultado.valorIcms)} />
              <Linha
                rotulo="PIS/PASEP"
                valor={moeda.format(resultado.valorPis)}
              />
              <Linha
                rotulo="COFINS"
                valor={moeda.format(resultado.valorCofins)}
              />
            </tbody>
          </Table>
        </Col>
      </Row>
    </Card.Body>
  </Card>
)

export default ResultadoCalculadora
