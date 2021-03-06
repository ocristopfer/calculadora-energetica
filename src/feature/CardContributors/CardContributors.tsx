import { Figure } from 'react-bootstrap'
import { ICardContributors } from './CardContributors.types'

const CardContributors = (props: any) => {
  let CardContributors = props.CardContributors as ICardContributors
  return (
    <>
      <Figure className="m-2">
        <Figure.Image
          width={128}
          height={128}
          alt="128x128"
          src={
            CardContributors.avatar_url !== ''
              ? CardContributors.avatar_url
              : 'Sem imagem'
          }
        />

        <Figure.Caption>
          <div>
            <a
              target="_blank"
              href={CardContributors.html_url}
              rel="noreferrer"
            >
              @{CardContributors.login}
            </a>
          </div>
          <div>Contribuições: {CardContributors.contributions}</div>
        </Figure.Caption>
      </Figure>
    </>
  )
}

export default CardContributors
