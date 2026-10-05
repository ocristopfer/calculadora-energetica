import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { CardContributors } from '../../feature'
import { ICardContributors } from '../../feature/CardContributors/CardContributors.types'
import {
  FONTE_TARIFAS,
  TARIFAS_ATUALIZADAS_EM,
} from '../../data/distribuidoras'

// API pública do GitHub: não precisa (e não deve) usar token num site estático
const GITHUB_API =
  'https://api.github.com/repos/ocristopfer/calculadora-energetica/contributors'

const About = () => {
  const [data, setData] = useState<ICardContributors[]>([])

  useEffect(() => {
    fetch(GITHUB_API, { headers: { Accept: 'application/vnd.github+json' } })
      .then((res) => (res.ok ? res.json() : []))
      .then((json) => setData(Array.isArray(json) ? json : []))
      .catch(() => setData([]))
  }, [])

  return (
    <>
      <Card className="mt-3">
        <Card.Header>Sobre</Card.Header>
        <Card.Body>
          <p>
            Calculadora para estimar o valor da conta de luz residencial a
            partir da leitura do medidor, usando a tarifa da sua distribuidora,
            a bandeira tarifária do mês e os tributos (ICMS, PIS/PASEP e COFINS)
            do seu estado.
          </p>
          <p className="mb-0">
            Fonte das tarifas: {FONTE_TARIFAS}. Atualizado em{' '}
            {new Date(`${TARIFAS_ATUALIZADAS_EM}T12:00:00`).toLocaleDateString(
              'pt-BR',
            )}
            .
          </p>
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header>Lista de contribuidores</Card.Header>
        <Card.Body>
          {data.length > 0
            ? data.map((item) => (
                <CardContributors key={item.login} CardContributors={item} />
              ))
            : 'ocristopfer'}
        </Card.Body>
      </Card>
    </>
  )
}
export default About
