# Calculadora Energética

[![Deploy GitHub Pages](https://github.com/ocristopfer/calculadora-energetica/actions/workflows/deploy.yml/badge.svg)](https://github.com/ocristopfer/calculadora-energetica/actions/workflows/deploy.yml)

Calcula uma estimativa da conta de luz residencial a partir da leitura do
medidor, usando a tarifa da distribuidora do seu estado (Light, Enel, Copel,
Cemig, CPFL, Celesc, Neoenergia, Equatorial, Energisa e outras).

**Acesse:** https://ocristopfer.github.io/calculadora-energetica/

## Como o cálculo é feito

1. **Consumo** = leitura atual − leitura anterior. Se for menor que o custo de
   disponibilidade (30/50/100 kWh para mono/bi/trifásico), cobra-se o mínimo.
2. **Tarifa sem tributos** = TE + TUSD da distribuidora (residencial B1,
   modalidade convencional), homologada pela ANEEL.
3. **Bandeira tarifária**: acréscimo por kWh (valores da ANEEL por 100 kWh).
4. **Tributos "por dentro"**, como nas contas das distribuidoras:
   `valor com tributos = valor sem tributos / (1 − (ICMS + PIS + COFINS))`.
   O ICMS usa a alíquota do estado (com faixas de isenção/redução onde
   cadastradas). PIS/COFINS variam mês a mês e podem ser ajustados.
5. **Iluminação pública (COSIP/CIP)**: tabela do município quando cadastrada
   (hoje, Rio de Janeiro); nas demais cidades informe o valor da sua conta.

Todos os parâmetros podem ser sobrescritos em _Opcional_ com os valores da
sua fatura.

## Dados

| Arquivo | Conteúdo |
| --- | --- |
| `src/data/tarifas.json` | Tarifas por distribuidora e valores das bandeiras |
| `src/data/estados.ts` | ICMS por estado |
| `src/data/municipios.ts` | Tabelas de COSIP por município |

As tarifas vêm dos [dados abertos da ANEEL](https://dadosabertos.aneel.gov.br/dataset/tarifas-distribuidoras-energia-eletrica)
(tarifa de aplicação vigente, residencial B1 convencional) e são atualizadas
automaticamente:

- **A cada deploy** (push na `main` e toda segunda-feira) o site é gerado com
  as tarifas vigentes no dia.
- **A cada 15 dias** o workflow _Atualizar tarifas ANEEL_ abre um PR com o
  `src/data/tarifas.json` atualizado, para manter os dados versionados.

Para atualizar localmente:

```bash
npm run tarifas:atualizar
```

Distribuidoras com o selo _estimada_ ainda não tiveram o valor confirmado pela
ANEEL. Se a ANEEL passar a usar uma sigla nova, o script lista o agente em
"Sem mapeamento" — basta adicioná-lo em `MAPA_AGENTES`
(`scripts/tarifas-aneel.mjs`). Pequenas distribuidoras e cooperativas ainda
não estão cadastradas; contribuições são bem-vindas.

## Desenvolvimento

Requer Node.js 20+.

```bash
npm install
npm run dev      # servidor local
npm test         # testes (vitest)
npm run build    # gera ./build
```

Com Docker: `docker compose up --build` e acesse http://localhost:3001.

## Deploy (GitHub Pages)

O workflow `.github/workflows/deploy.yml` publica em
https://ocristopfer.github.io/calculadora-energetica/ a cada push na `main`
(Settings → Pages → Source: **GitHub Actions**). PRs passam pelo workflow
`ci.yml` (testes e build).

## Contribuindo

Para adicionar a COSIP de uma cidade ou corrigir uma alíquota de ICMS, edite
os arquivos em `src/data/` e abra um PR.
