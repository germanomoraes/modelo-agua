# Código da IA sob inspeção: Fatura de Água da Associação Comunitária

**Dupla:** [nome do estudante A] e [nome do estudante B]
**Disciplina:** Qualidade de Software, ADS, IFCE Campus Boa Viagem
**Ferramenta de IA usada:** [ex.: ChatGPT, Claude, Gemini, Copilot]

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

*Enviem à IA apenas o conteúdo de `requisitos.md` e peçam a implementação completa das quatro funções. Colem o código em `src/agua.js` **sem alterar nada** e façam um commit com a mensagem "Código original gerado pela IA".*

- **Link do commit com o código original:** [link]
- **A IA fez alguma pergunta ou apontou alguma ambiguidade antes de implementar?** [sim ou não; se sim, quais]
- **Que decisões a IA tomou sozinha, sem perguntar?** *(ex.: como arredondar, como tratar datas, o que fazer com entradas inválidas)*

[escrevam aqui]

## Parte 2: verificação

*Verificação responde: "o código faz o que a especificação diz?".*

### 2.1 Divisão dos testes

| Integrante | Funções sob sua responsabilidade |
|---|---|
| [estudante A] | [função 1] e [função 2] |
| [estudante B] | [função 3] e [função 4] |

### 2.2 Casos de teste

*Mínimo de 24 casos no total, com pelo menos 5 por função, escritos a partir de `requisitos.md`. Incluam obrigatoriamente: valores de fronteira, arredondamento ou datas (conforme o cenário), combinações de regras e entradas inválidas. Rodem contra o código **original** da IA.*

| ID | Função | Requisito | Entrada | Resultado esperado | Resultado obtido (código da IA) | Passou? |
|---|---|---|---|---|---|---|
| CT01 | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| ... | | | | | | |

**Resultado:** [X] de [Y] testes falharam no código original.

### 2.3 Revisão cruzada dos testes

*Antes de rodar, cada integrante revisou os testes do outro. Registrem o que a revisão encontrou: testes com resultado esperado errado, casos importantes que faltavam, testes repetidos. Lembrem: revisão é uma atividade de controle da qualidade (QC).*

| Revisor | O que encontrou nos testes do colega | O que mudou |
|---|---|---|
| [estudante A] | [ ] | [ ] |
| [estudante B] | [ ] | [ ] |

### 2.4 Defeitos encontrados

| # | Função | Defeito (causa no código) | Falha (sintoma) | Requisito violado |
|---|---|---|---|---|
| D1 | [ ] | [ ] | [ ] | [ ] |

### 2.5 Correções

*Corrijam os defeitos em commits separados (de preferência um por defeito) e expliquem cada correção. Lacunas da especificação (casos que ela não define) exigem uma **decisão** da dupla: registrem a decisão e a justificativa. Ao final, todos os testes da dupla devem passar.*

[escrevam aqui]

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

- **[estudante A]:** *Como você passaria a usar IA para gerar código depois desta atividade?*
- **[estudante B]:** *Idem.*

## Parte 7: divisão do trabalho

| Parte | Responsável principal | Participação do outro integrante |
|---|---|---|
| Parte 1 | [ ] | [ ] |
| Parte 2 | [ ] | [ ] |
| Parte 3 | [ ] | [ ] |
| Partes 4 a 6 | [ ] | [ ] |
