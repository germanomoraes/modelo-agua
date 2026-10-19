# Código da IA sob inspeção: Fatura de Água da Associação Comunitária

**Dupla:** Rony e Germano
**Disciplina:** Qualidade de Software, ADS, IFCE Campus Boa Viagem
**Ferramenta de IA usada:**  Claude

> Apaguem as instruções em itálico ao preencher. Sigam as partes **na ordem**. A Parte 3 só começa quando o professor publicar o depoimento no Classroom.

## Estrutura do repositório

| Arquivo | Conteúdo |
|---|---|
| `requisitos.md` | Especificação entregue à IA (não alterem) |
| `src/agua.js` | Código gerado pela IA e as correções da dupla |
| `test/agua.test.js` | Casos de teste da dupla |
| `evidencias/` | Testes gerados pela IA (Parte 2.5) e outras evidências |
| `depoimento.md` | Depoimento publicado pelo professor (copiem para cá na Parte 3) |
| `prompts.md` | Registro do uso da IA |
| `README.md` | Este relatório |

Para rodar os testes da dupla: `npm test` (Node.js 18 ou superior).

---

## Parte 1: o código gerado pela IA (feita em sala)

- **Link do commit com o código original:** https://github.com/germanomoraes/modelo-agua/commit/a7ce2ab
  (tentativa anterior, commit de2acfc: pedido só com 2 funções, descartado por não cobrir as 4 funções da especificação)
- **A IA fez alguma pergunta ou apontou alguma ambiguidade antes de implementar?** não
- **Que decisões a IA tomou sozinha, sem perguntar?**
  - Entradas inválidas: lança erro (RangeError/TypeError) para leituras fora de 0 a 9999, decimais ou texto, consumo negativo ou decimal, valor negativo e datas fora do formato.
  - Dinheiro calculado em centavos inteiros, para evitar erro de ponto flutuante.
  - Datas tratadas em UTC.
  - `pagamento` ausente (undefined ou null) significa sem encargos; string vazia lança erro.
  - `gerarFatura` não valida `nome`, e não valida `vencimento` quando não há pagamento.
  - Valor com fração de centavo é arredondado em silêncio (10.005 vira 10,00).
  - Feriados não são tratados, apenas sábado e domingo.

## Parte 2: verificação

*Verificação responde: "o código faz o que a especificação diz?".*

### 2.1 Divisão dos testes

| Integrante | Funções sob sua responsabilidade |
|---|---|
| Rony | calcularConsumo e calcularEncargos |
| Germano | calcularTarifa e gerarFatura |

### 2.2 Casos de teste

*Mínimo de 24 casos no total, com pelo menos 5 por função, escritos a partir de `requisitos.md`. Incluam obrigatoriamente: valores de fronteira, arredondamento ou datas (conforme o cenário), combinações de regras e entradas inválidas. Rodem contra o código **original** da IA.*

| ID | Função | Requisito | Entrada | Resultado esperado | Resultado obtido (código da IA) | Passou? |
|---|---|---|---|---|---|---|
| CC01 | calcularConsumo | RF02 | (0, 0) | 0 | 0 | Sim |
| CC02 | calcularConsumo | RF03 | (500, 500) | 0 | 0 | Sim |
| CC03 | calcularConsumo | RF03 | (9990, 10) | 20 | 20 | Sim |
| CC04 | calcularConsumo | RF03 | (9999, 0) | 1 | 1 | Sim |
| CC05 | calcularConsumo | RF01 | (0, 9999) | 9999 | 9999 | Sim |
| CC06 | calcularConsumo | RF01 (lacuna) | (-1, 10) | lança erro | RangeError | Sim |
| CC07 | calcularConsumo | RF01 (lacuna) | (10.5, 20) | lança erro | RangeError | Sim |
| CC08 | calcularConsumo | RF01 (lacuna) | (0, 10000) | lança erro | RangeError | Sim |
| CE01 | calcularEncargos | RF08 | (100, 2026-10-15, 2026-10-15) | {0, 0} | {0, 0} | Sim |
| CE02 | calcularEncargos | RF08 | (100, 2026-10-15, 2026-10-14) | {0, 0} | {0, 0} | Sim |
| CE03 | calcularEncargos | RF10 | (100, 2026-10-15, 2026-10-16) | {2, 0.03} | {2, 0.03} | Sim |
| CE04 | calcularEncargos | RF10 | (100, 2026-10-15, 2026-10-25) | {2, 0.33} | {2, 0.33} | Sim |
| CE05 | calcularEncargos | RF09 | (100, 2026-10-17, 2026-10-19) | {0, 0} | {0, 0} | Sim |
| CE06 | calcularEncargos | RF09, RF10 | (100, 2026-10-17, 2026-10-20) | {2, 0.10} | {2, 0.1} | Sim |
| CE07 | calcularEncargos | RF09, RF10 | (100, 2026-10-18, 2026-10-20) | {2, 0.07} | {2, 0.07} | Sim |
| CE08 | calcularEncargos | RF11 | (50, 2026-10-15, 2026-10-25) | {1, 0.17} | {1, 0.17} | Sim |
| CE09 | calcularEncargos | RF11 | (26.75, 2026-10-15, 2026-10-16) | {0.54, 0.01} | {0.54, 0.01} | Sim |
| CE10 | calcularEncargos | RF10 | (100, 2026-12-31, 2027-01-04) | {2, 0.13} | {2, 0.13} | Sim |
| CE11 | calcularEncargos | RF10 | (100, 2028-02-28, 2028-03-01) | {2, 0.07} | {2, 0.07} | Sim |
| CE12 | calcularEncargos | RF09 | (100, 2026-10-16, 2026-10-17) | {2, 0.03} | {2, 0.03} | Sim |
| CE13 | calcularEncargos | RF10 | (0, 2026-10-15, 2026-10-20) | {0, 0} | {0, 0} | Sim |
| CT01 | calcularTarifa | RF04 | 0 | 15,00 | 15 | Sim |
| CT02 | calcularTarifa | RF04 | 10 | 15,00 | 15 | Sim |
| CT03 | calcularTarifa | RF05 | 11 | 17,35 | 17.35 | Sim |
| CT04 | calcularTarifa | RF05 | 20 | 38,50 | 38.5 | Sim |
| CT05 | calcularTarifa | RF06 | 21 | 41,65 | 41.65 | Sim |
| CT06 | calcularTarifa | RF06 | 22 | 44,80 | 44.8 | Sim |
| CT07 | calcularTarifa | RF04 (lacuna) | -1 | lança erro | RangeError | Sim |
| CT08 | calcularTarifa | RF07 (lacuna) | 2.5 | lança erro | RangeError | Sim |
| GF01 | gerarFatura | RF13, RF14 | leituras 100 e 130, sem pagamento | consumo 30, valorAgua 70, total 70 | igual ao esperado | Sim |
| GF02 | gerarFatura | RF08, RF14 | leituras 100 e 130, pagamento em dia | consumo 30, valorAgua 70, total 70 | igual ao esperado | Sim |
| GF03 | gerarFatura | RF10, RF11, RF14 | leituras 100 e 130, 1 dia de atraso | multa 1,40, juros 0,02, total 71,42 | igual ao esperado | Sim |
| GF04 | gerarFatura | RF03 | leituras 9990 e 10, sem pagamento | consumo 20, valorAgua 38,50, total 38,50 | igual ao esperado | Sim |
| GF05 | gerarFatura | RF13 (lacuna) | pagamento "" | lança erro | TypeError | Sim |

**Resultado:** 0 de 34 testes da dupla falharam no código original (21 do Rony e 13 do Germano). Os 2 exemplos (EX01 e EX02) também passaram.

### 2.3 Revisão cruzada dos testes

*Antes de rodar, cada integrante revisou os testes do outro. Registrem o que a revisão encontrou: testes com resultado esperado errado, casos importantes que faltavam, testes repetidos. Lembrem: revisão é uma atividade de controle da qualidade (QC).*

| Revisor | O que encontrou nos testes do colega | O que mudou |
|---|---|---|
| Rony | Revisou os testes do Germano focados em calcularTarifa e gerarFatura. Verificou a cobertura de fronteiras e lacunas. | Nenhuma mudança estrutural necessária, os testes refletiam as decisões da dupla sobre lacunas. |
| Germano | Revisou os testes do Rony (calcularConsumo e calcularEncargos). Observou a validação de datas e valores limites (0 a 9999). | Nenhuma alteração; os resultados esperados estavam de acordo com a especificação. |

### 2.4 Defeitos encontrados

**Funções do Rony (calcularConsumo e calcularEncargos):** nenhum defeito encontrado nos casos executados. Foram identificadas lacunas da especificação (entradas inválidas, `pagamento` vazio, feriados), tratadas como decisões na seção 2.5, e não como defeitos.

**Funções do Germano (calcularTarifa e gerarFatura):** nenhum defeito encontrado nos casos executados. Os 13 testes passaram no código original. As lacunas da especificação (consumo negativo ou decimal, `pagamento` vazio) foram tratadas como decisões na seção 2.5, e não como defeitos.

| # | Função | Defeito (causa no código) | Falha (sintoma) | Requisito violado |
|---|---|---|---|---|
| - | N/A | Nenhum defeito técnico direto encontrado nos testes | N/A | N/A |

### 2.5 Correções

**Funções do Rony (calcularConsumo e calcularEncargos):** nenhum defeito exigiu correção. Decisões da dupla sobre as lacunas da especificação:
- **Entradas inválidas** (leitura negativa, decimal ou acima de 9999; valor ou data inválidos): mantém-se o comportamento da IA, que lança erro. Justificativa: devolver um valor silencioso geraria cobrança errada ao morador, e um erro explícito evidencia o problema de leitura ou digitação.
- **Feriados:** não tratados. Fica como limitação conhecida, pois a especificação só prevê sábado e domingo (RF09).

**Funções do Germano (calcularTarifa e gerarFatura):** nenhum defeito exigiu correção. Decisões da dupla sobre as lacunas da especificação:
- **Consumo negativo ou decimal em `calcularTarifa`:** mantém-se o erro lançado pela IA (RangeError). Justificativa: o consumo vem do hidrômetro em m³ inteiros, então um valor assim indica erro de leitura, e cobrar um valor errado seria pior que avisar.
- **`pagamento` como texto vazio em `gerarFatura`:** mantém-se o erro (TypeError). Justificativa: o RF13 fala em "não informado", e um texto vazio é um dado inválido, não ausência de dado.
- **`nome` sem validação:** limitação aceita, pois a especificação não define regras para o nome.

### 2.6 Os testes da IA

*Peçam à IA que gere testes para o código que ela mesma escreveu (registrem o prompt). Salvem os testes em `evidencias/testes-gerados-pela-ia.js` e rodem contra o código **original** com `node --test evidencias/testes-gerados-pela-ia.js`.*

- **Quantos testes a IA gerou?** [ ]
- **Quantos dos defeitos encontrados pela dupla os testes da IA detectaram?** [ ]
- **Por que isso aconteceu?** *(de onde a IA tira o "resultado esperado" quando gera testes a partir do próprio código?)*

[escrevam aqui]

## Parte 3: validação

*Validação responde: "o código resolve o problema real?". Comecem esta parte só depois que o professor publicar o depoimento no Classroom. Copiem o depoimento para o arquivo `depoimento.md` e façam um commit.*

### 3.1 Divergências

| # | Necessidade real (depoimento) | O que a especificação diz | O código atende? | Característica da ISO/IEC 25010 envolvida |
|---|---|---|---|---|
| 1 | [ ] | [ ] | [ ] | [ ] |
| 2 | [ ] | [ ] | [ ] | [ ] |
| 3 | [ ] | [ ] | [ ] | [ ] |
| 4 | [ ] | [ ] | [ ] | [ ] |
| 5 | [ ] | [ ] | [ ] | [ ] |

### 3.2 Requisitos revisados

*Reescrevam os requisitos que precisam mudar e criem os que faltam (ex.: "RF03 (revisado): ...", "RF15 (novo): ..."). Não é preciso implementar.*

[escrevam aqui]

### 3.3 Reflexão

*O código estava errado ou a especificação estava errada? Os testes da Parte 2 encontrariam essas divergências? Por quê?*

[escrevam aqui]

## Parte 4: o código à luz da ISO/IEC 25010

*Avaliem o código **original** da IA, com evidências (trechos de código, testes que falharam).*

| Característica | Subcaracterística | Avaliação | Evidência |
|---|---|---|---|
| Adequação funcional | [ ] | [ ] | [ ] |
| Confiabilidade | [ ] | [ ] | [ ] |
| Manutenibilidade | [ ] | [ ] | [ ] |
| Capacidade de interação (2023) | [ ] | [ ] | [ ] |
| Segurança (*security*) ou *safety* (2023) | [ ] | [ ] | [ ] |

## Parte 5: garantia da qualidade (QA)

*Proponham três práticas de processo para uma equipe que usa IA para gerar código, cada uma ligada a um defeito ou divergência que vocês encontraram.*

1. [prática]: [o que teria evitado]
2. [prática]: [o que teria evitado]
3. [prática]: [o que teria evitado]

## Parte 6: o que a IA errou

| # | O que a IA fez ou afirmou | Classificação | Evidência |
|---|---|---|---|
| 1 | [ ] | Defeito / Suposição não declarada / Afirmação incorreta / Correto | [ ] |
| 2 | [ ] | [ ] | [ ] |
| 3 | [ ] | [ ] | [ ] |

**Reflexão final (1 parágrafo por integrante):**

- **Rony:** *Como você passaria a usar IA para gerar código depois desta atividade?*
- **Germano:** *Idem.*

## Parte 7: divisão do trabalho

| Parte | Responsável principal | Participação do outro integrante |
|---|---|---|
| Parte 1 | Rony | [ ] |
| Parte 2 | Rony (calcularConsumo e calcularEncargos) e Germano (calcularTarifa e gerarFatura) | [ ] |
| Parte 3 | [ ] | [ ] |
| Partes 4 a 6 | [ ] | [ ] |