import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import CardContributors from '../CardContributors'

const About = () => {
  const GitHubAPI = `${process.env.REACT_APP_GITHUBAPI}repos/ocristopfer/bot-vector/contributors?anon=1`
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(GitHubAPI, {
      method: 'GET',
      headers: {
        Authorization: process.env.REACT_APP_GITHUBTOKEN || '',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(
        (data) => {
          setData(data)
        },
        (error) => {
          console.log(error)
        },
      )
  }, [GitHubAPI])

  return (
    <>
      <React.Fragment>
        <Card className="mt-3">
          <Card.Header>Lista de contribuidores</Card.Header>
          <Card.Body>
            {data.length > 0
              ? data.map((item) => (
                  <CardContributors
                    key={item}
                    CardContributors={item}
                  ></CardContributors>
                ))
              : 'ocristopfer'}
          </Card.Body>
        </Card>
      </React.Fragment>
    </>
  )
}
export default About
