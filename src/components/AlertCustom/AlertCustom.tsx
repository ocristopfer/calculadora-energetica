import * as React from 'react'
import { Alert } from 'react-bootstrap'
import Parser from 'html-react-parser'
import { IAlert } from './AlertCustom.types'

const AlertCustom = ({
  isVisible,
  variant = 'danger',
  titulo = 'Erro',
  message = 'Algum erro ocorreu!',
}: IAlert) => {
  const [show, setShow] = React.useState(isVisible)
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
          {Parser(message)}
        </Alert>
      ) : (
        ''
      )}
    </>
  )
}

export default AlertCustom
