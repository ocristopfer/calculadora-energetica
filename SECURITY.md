# Política de segurança

A Calculadora Energética é um site estático: o cálculo roda inteiramente no
navegador, não há backend nem login, e nenhum dado digitado é enviado a
servidores. Ainda assim, problemas de segurança são levados a sério.

## Como reportar uma vulnerabilidade

**Não** abra uma issue pública. Use o relatório privado de vulnerabilidades do
GitHub (botão "Report a vulnerability" na aba **Security** do repositório) e informe:

- o que é afetado (site publicado, workflows do GitHub Actions, scripts de
  atualização de tarifas, imagem Docker);
- os passos para reproduzir, ou uma prova de conceito;
- o navegador e, se for o caso, o commit ou a data em que observou o problema.

Você deve receber uma resposta em alguns dias. A correção é publicada na `main`
e vai para o ar no deploy seguinte.

## Versões suportadas

Apenas a versão publicada em https://ocristopfer.github.io/calculadora-energetica/
(a branch `main`) recebe correções.

## Escopo

Dentro do escopo, por exemplo:

- XSS ou injeção de conteúdo no site;
- dados maliciosos vindos da API da ANEEL que acabem executados ou exibidos sem
  tratamento;
- workflows do GitHub Actions que permitam a terceiros (por exemplo, via PR)
  executar código com as permissões do repositório;
- dependências npm vulneráveis que de fato afetem o site publicado.

Fora do escopo: valores de tarifa, ICMS ou COSIP incorretos — isso é um erro de
dados, abra uma issue ou um PR normalmente.
