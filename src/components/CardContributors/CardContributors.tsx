import { ICardContributors } from '../../interfaces/props/ICardContributors'

const CardContributors = (props: any) => {
  let CardContributors = props.CardContributors as ICardContributors
  return (
    <>
      <div>
        <img alt="img" src={CardContributors.avatar_url} />
        {CardContributors.login}
      </div>
    </>
  )
}

export default CardContributors
