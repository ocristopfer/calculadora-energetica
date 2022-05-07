import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import Parser from "html-react-parser";

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
        <Alert.Heading>{Parser(titulo)}</Alert.Heading>
        {Parser(msg)}
      </Alert>
    );
  }
}

export default AlertDismissibleExample;
