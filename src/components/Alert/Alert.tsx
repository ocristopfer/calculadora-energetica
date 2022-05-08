import React, { useState } from 'react'
import { Alert } from 'react-bootstrap'
import Parser from 'html-react-parser'
import { IAlert } from '../../interfaces/props/IAlert'

const AlertDismissibleExample = ({
  bFlShowAlert,
  variant = 'danger',
  titulo = 'Erro',
  msg = 'Algum erro ocorreu!',
}: IAlert) => {
  const [show, setShow] = useState(bFlShowAlert)
  return (
    <>
      {show ? (
        <Alert
          className="mt-3"
          variant={variant}
          onClose={() => setShow(false)}
          dismissible
        >
          <Alert.Heading>{Parser(titulo)}</Alert.Heading>
          {Parser(msg)}
        </Alert>
      ) : (
        ''
      )}
    </>
  )
}

export default AlertDismissibleExample
