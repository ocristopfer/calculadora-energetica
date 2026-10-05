import { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { IAlert } from './AlertCustom.types'

const AlertCustom = ({
  isVisible,
  variant = 'danger',
  titulo = 'Erro',
  children = 'Algum erro ocorreu!',
}: IAlert) => {
  const [show, setShow] = useState(isVisible)
  if (!show) return null
  return (
    <Alert
      className="mt-3"
      variant={variant}
      onClose={() => setShow(false)}
      dismissible
    >
      <Alert.Heading>{titulo}</Alert.Heading>
      {children}
    </Alert>
  )
}

export default AlertCustom
