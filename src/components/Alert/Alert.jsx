import React, { useState } from "react";
import { Alert } from "react-bootstrap";

function AlertDismissibleExample({
  bFlShowAlert,
  variant = "danger",
  titulo = "Erro",
  msg = "Algum erro ocorreu!",
}) {
  const [show, setShow] = useState(bFlShowAlert);
  if (show) {
    return (
      <Alert variant={variant} onClose={() => setShow(false)} dismissible>
        <Alert.Heading>{titulo}</Alert.Heading>
        <p>{msg}</p>
      </Alert>
    );
  }

  //return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}

export default AlertDismissibleExample;
