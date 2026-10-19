# Registro do uso da IA

**Dupla:** [Ronald e Germano ]
**Atividade:** Código da IA sob inspeção: Fatura de Água da Associação Comunitária
**Ferramenta(s) usada(s):** [Claude ]

> Registre todos os prompts relevantes, na ordem em que foram usados. Obrigatórios: o prompt que gerou o código (Parte 1) e o prompt que gerou os testes da IA (Parte 2.6). Não é preciso colar a resposta inteira da IA: resuma o que ela respondeu e diga o que você fez com isso.

---

## Prompt 1 (descartado)

**Data:** [14/10/2026]

**Prompt:**

```
[diante disso acima , Implemente em JavaScript (Node.js), no formato CommonJS, as duas  funções( calcularConsumo e calcularEncargos
descritas na especificação abaixo, completas e prontas para uso.

[conteúdo do requisitos.md]]
```

**Resumo da resposta:** [Usei esse prompt para que a IA implementasse calcularConsumo e calcularEncargos a partir do requisitos.md (RF01 a RF12), obtendo funções completas e prontas para uso na atividade de QA. Pedi só duas funções para manter o código focado e testável, cobrindo os casos de borda: volta do hidrômetro, vencimento em fim de semana, multa, juros e arredondamento. O resultado serve de base para criar e validar os testes e documentar o processo no prompts.md.]

**O que fiz com isso:** 

[Usei esse prompt para que a IA gerasse calcularConsumo e calcularEncargos a partir do requisitos.md, de modo que eu tivesse uma base pronta para testar e validar na atividade de QA.]

---

## Prompt 2

**Data:** [14/10/2026]

**Prompt:**

```
[```markdown
# Especificação de requisitos: fatura de água da associação comunitária

**Sistema:** Gestão de Água da Associação Comunitária do Sítio Lagoa Seca (fictícia)
**Módulo:** cálculo da fatura mensal de água de cada morador
**Versão:** 1.0

## Contexto

A associação de moradores administra o poço comunitário e cobra mensalmente pela água consumida por cada casa, medida por hidrômetro.

## Interface

Implementar em JavaScript puro (Node.js), no arquivo `src/agua.js`, exportando as quatro funções no formato CommonJS:

```js
module.exports = { calcularConsumo, calcularTarifa, calcularEncargos, gerarFatura };
```

Todos os valores em dinheiro são números em reais (exemplo: `17.35`). Todas as datas são textos no formato `"AAAA-MM-DD"`.

## Requisitos funcionais

### Função 1: `calcularConsumo(leituraAnterior, leituraAtual)`

**RF01.** As leituras do hidrômetro são números inteiros de 0 a 9999, em metros cúbicos (m³).

**RF02.** O consumo é a diferença entre a leitura atual e a anterior.

**RF03.** O hidrômetro tem 4 dígitos: depois de 9999, ele volta a 0. Se a leitura atual for menor que a anterior, considera-se que o hidrômetro completou uma volta. Exemplo: leitura anterior 9990 e atual 10 representam consumo de 20 m³.

### Função 2: `calcularTarifa(consumo)`

**RF04.** Até 10 m³, o morador paga a taxa mínima de R$ 15,00, inclusive com consumo zero.

**RF05.** Cada m³ entre 11 e 20 custa R$ 2,35, somado à taxa mínima.

**RF06.** Cada m³ acima de 20 custa R$ 3,15, somado aos valores das faixas anteriores. Exemplo: 22 m³ custam 15,00 + 10 × 2,35 + 2 × 3,15 = R$ 44,80.

**RF07.** O valor é arredondado ao centavo.

### Função 3: `calcularEncargos(valor, vencimento, pagamento)`

**RF08.** Se o pagamento for feito até a data de vencimento (inclusive), não há encargos.

**RF09.** Se o vencimento cair em um sábado ou domingo, o pagamento pode ser feito até a segunda-feira seguinte sem encargos.

**RF10.** Pago com atraso, incidem sobre o valor:
- multa de 2%;
- juros de 0,033% por dia corrido de atraso, contados a partir da data de vencimento original.

**RF11.** A multa e os juros são arredondados ao centavo, cada um separadamente, com a regra "meio para cima" (R$ 0,005 vira R$ 0,01).

**RF12.** A função retorna `{ multa, juros }`.

### Função 4: `gerarFatura(dados)`

**RF13.** Recebe um objeto `{ nome, leituraAnterior, leituraAtual, vencimento, pagamento }`. O campo `pagamento` é opcional: se não for informado, a fatura é emitida sem encargos.

**RF14.** Retorna `{ nome, consumo, valorAgua, multa, juros, total }`, em que `total` é a soma de `valorAgua`, `multa` e `juros`.

## Exemplo

```js
gerarFatura({ nome: "José", leituraAnterior: 120, leituraAtual: 135, vencimento: "2026-10-15" })
// { nome: "José", consumo: 15, valorAgua: 26.75, multa: 0, juros: 0, total: 26.75 }
```

```

diante disso acima , Implemente em JavaScript (Node.js), no formato CommonJS, as dquatro   funções
descritas na especificação abaixo, completas e prontas para uso.
[conteúdo do requisitos.md]
[]]
```

**Resumo da resposta:** [ Usei esse prompt porque a especificação já descrevia cada requisito (RF01 a RF14), o que permite à IA gerar o código completo sem precisar adivinhar regras de negócio.
O resultado foi um arquivo src/agua.js com quatro funções (calcularConsumo, calcularTarifa, calcularEncargos e gerarFatura) que tratam a volta do hidrômetro, as tarifas por faixa, a multa e os juros com prorrogação de fim de semana, e o cálculo do total.]

**O que fiz com isso:** [Usei como código original em src/agua.js, sem alterações.
 ]

---

## Prompt 3

## Prompt 3: Geração de testes a partir do próprio código (Parte 2.6)
**Objetivo:** Ver o que a IA faz quando testa um código tendo apenas o próprio código como base, sem conhecer os requisitos.

**Resumo da resposta da IA:**
A IA gerou 14 casos de teste usando `node:test` e `node:assert/strict`, cobrindo todas as quatro funções (calcularConsumo, calcularTarifa, calcularEncargos e gerarFatura). Os resultados esperados nos testes basearam-se inteiramente na lógica que já estava escrita no código (ex: o teste da volta do hidrômetro esperava que o cálculo cobrasse o valor de volta, sem questionar se era uma troca de hidrômetro).

**O que fizemos com a resposta:**
Criamos o arquivo `evidencias/testes-gerados-pela-ia.js` e colamos o código gerado. Rodamos com `node --test` e confirmamos que todos os 14 testes passaram. Usamos esse resultado para preencher as conclusões da seção 2.6 no `README.md`, evidenciando o viés de confirmação da IA.

**Total do balanço:** 10

---

## Prompt 4 (Germano)

**Data:** [13/10/2026]

**Prompt:**

**Resumo da resposta:** A IA recusou implementar as funções ou escrever os testes (a regra da atividade exige que sejam da dupla) e apontou inconsistências na estrutura de pastas (src/, test/, evidencias/). Sugeriu a divisão: Germano com calcularTarifa e gerarFatura, Ronald com calcularConsumo e calcularEncargos.

**O que fiz com isso:** Registrei a divisão na tabela 2.1 do README e organizei a estrutura do repositório.

---

## Prompt 5 (Germano)

**Data:** [13/10/2026]

**Prompt:**

**Resumo da resposta:** A IA explicou como mover os arquivos para a raiz (tirando a pasta aninhada), como conectar a pasta ao GitHub (git init, remote add, fetch, reset) e como fazer commit e push, com avisos sobre o OneDrive e sobre a identidade do autor no Git.

**O que fiz com isso:** Segui os passos e o template foi enviado ao GitHub.

---

## Prompt 6 (Germano)

**Data:** [18/10/2026]

**Prompt:**

**Resumo da resposta:** A IA leu o código e os testes e rodou npm test (23 passando). Corrigiu um erro dela (tinha dito que eu não tinha commits, mas eu tinha 4 do dia 13). Explicou o que faltava e apontou lacunas nos testes do Ronald para a revisão cruzada (data inválida, domingo pago na segunda, valor negativo).

**O que fiz com isso:** Usei como guia do que faltava. As lacunas dos testes do Ronald serviram de base para a seção 2.3.

---

## Prompt 7 (Germano)

**Data:** [18/10/2026]

**Prompt:**

**Resumo da resposta:** A IA recusou preencher os valores esperados, porque os casos de teste da Parte 2 precisam ser da dupla. Ensinou o método (fórmula da tarifa por faixas, exemplos resolvidos com 18 e 25 m³ que não estavam no meu arquivo, tabelas em branco e esqueletos de teste com `null` onde iam os meus valores).

**O que fiz com isso:** Calculei os valores de CT01 a CT05, do consumo 30 e de GF01 a GF04 (incluindo multa e juros do GF03) e preenchi os `null`. A IA conferiu e confirmou que estavam certos. Rodei npm test: 36 passando, 0 falhas.

---

## Prompt 8 (Germano)

**Data:** [18/10/2026]

**Prompt:**

**Resumo da resposta:** A IA forneceu as linhas da tabela 2.2 e rascunhos de texto para 2.4 e 2.5. Corrigiu um erro dela: o GF05 lança TypeError, não RangeError (confirmado rodando o código). Também errou a contagem de testes (disse 31, o certo eram 36).

**O que fiz com isso:** Colei a tabela 2.2 com os meus casos (CT01 a CT08 e GF01 a GF05) e o resultado "0 de 34 testes falharam". Preenchi a 2.4 (nenhum defeito encontrado nas minhas funções) e as decisões da 2.5 sobre as lacunas (consumo negativo ou decimal, pagamento vazio e nome sem validação). Conferi com o código que o GF05 lança TypeError, e não RangeError como a IA tinha dito. Na 2.3.

---

## Prompt 9 (Germano)

**Data:** [18/10/2026]

**Prompt:**

**Resumo da resposta:** A IA explicou a diferença entre verificação e validação, sugeriu 5 divergências do depoimento (hidrômetro trocado, leitura em branco, feriados, tarifa social, CPF) e testou o código contra cada situação. Montou a base da tabela 3.1 com o que a especificação diz e o que o código faz. Recusou escrever o texto final das três seções e deixou lacunas para a dupla preencher.

**O que fiz com isso:** Preenchi [a coluna da necessidade real, a característica da ISO, os requisitos revisados e a reflexão] com as minhas palavras. Os dados do código (exemplo de R$ 15.734,95 na troca de hidrômetro e encargos no feriado) vieram dos testes feitos pela IA, e eu conferi.

---

## Prompt 10 (Germano)

**Data:** [18/10/2026]

**Prompt:**

**Resumo da resposta:** A IA propôs entradas para o registro com o que realmente aconteceu em cada consulta, incluindo o que ela recusou fazer e os erros que cometeu, e sugeriu pontos para o balanço final.

**O que fiz com isso:** Adaptei o texto e conferi se cada entrada descreve o que realmente aconteceu.

---

## Balanço final

- **Total de prompts registrados:** 9 (2 do Ronald e 7 do Germano), mais o Prompt 3, reservado para os testes da IA (2.6).
- **Prompt que mais ajudou e por quê:** O Prompt 7. A IA não me deu o resultado pronto, ensinou o método da tarifa com exemplos e eu calculei os valores sozinho. Por isso consigo explicar cada teste na apresentação.
- **Prompt que gerou a resposta mais problemática e por quê:** O Prompt 6, e também o 8. A IA errou em três afirmações que eu só percebi porque conferi: disse que eu não tinha commits (eu tinha 4), disse que o GF05 lançava RangeError (era TypeError) e errou a contagem de testes (31 em vez de 36). Se eu tivesse copiado sem conferir, o README teria informações erradas.
- **Se eu fizesse de novo, perguntaria à IA de outra forma assim:** Pediria primeiro para explicar o método e só depois checaria meus resultados, em vez de pedir tudo pronto. E pediria à IA para me mostrar de onde veio cada afirmação sobre o código, para eu poder conferir rodando.