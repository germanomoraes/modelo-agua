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

### 2.6 Os testes da IA

- **Quantos testes a IA gerou?** 14 testes.
- **Quantos dos defeitos encontrados pela dupla os testes da IA detectaram?** 0 (Zero). Os testes da IA não detectaram nenhuma das divergências reais do depoimento (como a tarifa social, a troca de hidrômetro que cobra milhares de reais indevidos ou a questão dos feriados). Todos os 14 testes gerados pela IA passaram perfeitamente.
- **Por que isso aconteceu?** Isso aconteceu por causa do viés de confirmação (*echo chamber*). A IA tira o "resultado esperado" da própria lógica interna do código que ela leu. Como ela não leu o `requisitos.md` (e muito menos o depoimento real do cliente), ela assume que o código atual é a "verdade absoluta". Se o código diz que uma leitura menor significa que o hidrômetro "deu a volta", a IA cria um teste esperando que o sistema faça exatamente essa cobrança alta. Testes gerados a partir do código servem apenas para provar que o código faz o que ele já faz, mas são inúteis para descobrir se a regra de negócio implementada está correta para o mundo real.


## Parte 3: validação

*Validação responde: "o código resolve o problema real?". Comecem esta parte só depois que o professor publicar o depoimento no Classroom. Copiem o depoimento para o arquivo `depoimento.md` e façam um commit.*

### 3.1 Divergências

| # | Necessidade real (depoimento) | O que a especificação diz | O código atende? | Característica da ISO/IEC 25010 envolvida |
|---|---|---|---|---|
| 1 | Hidrômetro trocado recomeça do zero. É diferente de "dar a volta", pois "dar a volta" é quando o mesmo aparelho atinge o limite máximo (9999) e zera naturalmente, enquanto a troca significa que um equipamento totalmente novo, zerado, foi instalado no lugar do antigo quebrado. | RF03: leitura atual menor que a anterior significa volta do hidrômetro. | Não. Com leitura anterior 5000 e atual 3, calcula 5.003 m³ e cobra R$ 15.734,95. | Adequação funcional (Acurácia/Corretude) |
| 2 | Leitura em branco: quando a casa está fechada ou tem cachorro, o Toinho não consegue ler e deixa o campo em branco. Nesses casos, a associação cobra a média dos últimos três meses. | RF01: leituras são inteiros de 0 a 9999. Não prevê leitura faltando nem média. | Não. Com leitura `null`, lança `RangeError` e não gera fatura; também não recebe o histórico para calcular a média. | Adequação funcional (Completude) |
| 3 | Feriados: a sede física da associação, onde ocorrem os pagamentos, só funciona em dias úteis, por isso é impossível pagar presencialmente no dia do feriado. | RF09: só trata sábado e domingo. | Não. Vencimento na sexta 25/12 (Natal), pago na segunda 28/12: cobra multa de R$ 2,00 e juros de R$ 0,10 sobre R$ 100. | Adequação funcional (Completude) |
| 4 | Tarifa social: as famílias cadastradas no Cadastro Único pagam apenas a metade da taxa mínima (R$ 7,50), enquanto as demais pagam R$ 15,00. | RF04: taxa mínima fixa de R$ 15,00. | Não. A taxa mínima é uma constante no código e `calcularTarifa` só recebe o consumo, sem como informar a tarifa social. | Adequação funcional (Completude) |
| 5 | CPF: a planilha atual expõe os CPFs de todos os moradores no grupo de WhatsApp da diretoria, ferindo a privacidade. | Não fala de dados pessoais nem de privacidade. | Parcialmente. O código ignora campos extras como CPF e a fatura devolve só 6 campos, mas não há requisito nem mecanismo de proteção desses dados. | Segurança (Confidencialidade) |

### 3.2 Requisitos revisados

*   **RF03 (revisado):** Se a leitura atual for menor que a anterior, considera-se volta do hidrômetro, EXCETO quando houver o registro apontando a troca do equipamento. Nesse caso (troca de hidrômetro), o consumo a ser cobrado é o valor exato da leitura atual.
*   **RF15 (novo):** Em caso de leitura em branco (quando for impossível realizar a medição no mês), o sistema deve calcular o consumo cobrado com base na média de consumo dos últimos três meses daquela mesma residência.
*   **RF16 (novo):** Se a data de vencimento cair em um final de semana (sábado ou domingo) ou em um feriado (nacional ou municipal), o pagamento poderá ser efetuado até o próximo dia útil sem a cobrança de multa ou juros de mora.
*   **RF17 (novo):** Famílias vinculadas ao Cadastro Único possuem direito à Tarifa Social, que altera o valor da taxa mínima (consumo de 0 a 10 m³) para R$ 7,50. O excedente de consumo segue os valores normais estabelecidos.
*   **RF18 (novo):** Para garantir a proteção de dados, a fatura gerada e as planilhas de relatórios internos não devem conter CPFs ou documentos pessoais expostos em texto pleno, nem devem ser veiculadas em aplicativos de mensagens que violem a privacidade dos moradores.

### 3.3 Reflexão

A falha principal não foi do código gerado pela IA, mas sim da **especificação original** (`requisitos.md`), que era incompleta, pobre e distante da realidade operacional da associação. Os testes da Parte 2 de forma alguma teriam encontrado essas divergências. O motivo disso é que testes de código servem para realizar uma atividade de *Verificação* — atestar se o software foi construído seguindo fielmente as regras escritas no documento. O código gerado "gabaritou" todos os testes porque obedeceu perfeitamente à especificação. A divergência só surgiu na etapa de *Validação* (Parte 3), que é onde se descobre que as regras do papel não serviam para as necessidades do mundo real. O software estava perfeitamente desenvolvido para a especificação errada.


## Parte 4: o código à luz da ISO/IEC 25010

| Característica | Subcaracterística | Avaliação | Evidência |
|---|---|---|---|
| Adequação funcional | Corretude e completude funcional | Parcial. Calcula certo o que a especificação pede, mas cobra um valor absurdo quando o hidrômetro é trocado. | Linhas 60 a 63 do `src/agua.js`: leitura atual menor que a anterior vira "volta". Com anterior 5000 e atual 3, `gerarFatura` devolve consumo 5003 e valorAgua R$ 15.734,95 (`evidencias/demonstracao-divergencias.js`). Linhas 99 a 102: só sábado e domingo prorrogam, sem feriados. Linha 15: taxa mínima fixa, sem tarifa social. |
| Confiabilidade | Ausência de falhas e tolerância a falhas | Parcial. Valida leituras e datas com erro claro, mas aborta a fatura inteira quando a leitura está em branco. | Linhas 23 a 27 e 30 a 42: valida leituras e datas e lança erro claro. Linha 129: com leitura `null` a fatura inteira é abortada (`RangeError`), sem alternativa. Linhas 134 a 136: `vencimento` não é validado quando não há `pagamento`. |
| Manutenibilidade | Modularidade, modificabilidade e testabilidade | Boa, com ressalva. Funções pequenas e fáceis de testar, mas tarifa social e feriados exigiriam mudar as assinaturas das funções. | Linhas 11 a 21: constantes com nome. Funções pequenas, com o requisito (RF) comentado em cada uma. Funções puras e exportadas: 36 testes escritos sem alterar o código. Mas tarifa social e feriados exigiriam mudar as assinaturas das funções. |
| Capacidade de interação (2023) | Autodescritividade e assistência ao usuário | Fraca. A fatura só devolve os totais, sem detalhe por faixa nem histórico, e as mensagens de erro são técnicas. | Linha 142: a fatura devolve só os totais, sem detalhe por faixa nem histórico. Mensagens de erro técnicas (ex.: "deve ser um inteiro entre 0 e 9999"). |
| Segurança (*security*) | Confidencialidade | Fraca. Não existe nenhum requisito nem mecanismo de proteção de dados pessoais, embora o CPF não seja repassado para a fatura. | Linhas 127 e 142: só os campos necessários são lidos e devolvidos, então um CPF passado junto não aparece na fatura (demonstração). Mas não há requisito nem mecanismo de proteção de dados pessoais, e não há registro de quem leu ou alterou o quê. |


## Parte 5: garantia da qualidade (QA)

1. **Validação de Requisitos com Usuários Finais:** Teria evitado a cobrança absurda de R$ 15.734,95 na troca de hidrômetro, o erro de multar em dias de feriado e a falta da tarifa social (divergências 1, 3 e 4 da 3.1). Se a equipe tivesse validado as regras com quem opera o sistema de verdade (Seu Raimundo e Toinho) antes de mandar o `requisitos.md` para a IA, a especificação já contemplaria a realidade.

2. **Testes de Aceitação baseados no Mundo Real (UAT):** Teria evitado a "ilusão de perfeição" em que todos os 36 testes da Parte 2 passaram sem apontar nenhum defeito (divergências 1 a 4 da 3.1). Testes escritos a partir da especificação só encontram erros do código, não erros da própria especificação: eles passaram porque verificavam se o código obedecia a um papel incompleto. Se os cenários de teste incluíssem situações reais (por exemplo, "o que fazer se o cachorro estiver solto e a leitura vier em branco?"), as divergências teriam sido detectadas.

3. **Revisão Humana (Code Review) focada em Suposições Ocultas:** Poderia ter evitado que a IA tomasse decisões sozinha e sem avisar, como abortar a fatura inteira com um `RangeError` ao receber uma leitura vazia (divergência 2) ou assumir silenciosamente que feriados não existem (divergência 3). Um revisor humano treinado para buscar "o que a IA preencheu nas lacunas" teria boa chance de barrar esse código antes da produção.

## Parte 6: o que a IA errou

| # | O que a IA fez ou afirmou | Classificação | Evidência |
|---|---|---|---|
| 1 | Tratou "leitura atual menor que a anterior" estritamente como volta do hidrômetro, obedecendo a regra cega. | Correto | Linhas 60 a 63 do `src/agua.js`. Segue rigorosamente o RF03 e o teste de `calcularConsumo(9990, 10)` retorna 20 corretamente. A falha no mundo real vem da especificação, não do código da IA. |
| 2 | Lançou erros (`RangeError`, `TypeError`) para leitura negativa, decimal, texto e datas inválidas sem avisar. | Suposição não declarada | Linhas 23-27 e 30-42 do `src/agua.js`. A especificação não previa tratamento de erros, e a IA tomou essa decisão protetiva sozinha sem nos consultar. |
| 3 | Afirmou que usar centavos evita erros de flutuante, mas a fórmula de conversão inicial dela também falha para certos decimais. | Defeito | Linha 111: `Math.round(valor * 100)`. Ao executar com valor `0.145`, o Node faz `0.145 * 100` que dá `14.499999999999998`, arredondando para 14 centavos em vez de 15. |
| 4 | A própria IA que nos auxiliou na revisão errou ao analisar o nosso repositório e o código. | Afirmação incorreta | Registrado no `prompts.md` (Prompt 8): a IA disse que eram 31 testes (quando eram 36) e afirmou que o caso GF05 lançava `RangeError` (quando a execução prova que é `TypeError`). |

**Reflexão final (1 parágrafo por integrante):**

- **Rony:** *(Escreva aqui como você passaria a usar IA para gerar código depois desta atividade. Exemplo: O que você não deixaria de revisar? Como faria os prompts?)*
- **Germano:** Na atividade, aprendi que a IA é excelente para escrever a lógica do código, mas falha quando a especificação é incompleta pos ela preenche as lacunas sozinhas, sem avisar, e não tem como adivinhar o contexto real de uso. Foi o que aconteceu com a troca de hidrômetro e com os feriados, que o código não tratava e que só apareceram no depoimento do Seu Raimundo. Por isso, vou mudar a forma como faço os prompts: em vez de apenas enviar a especificação e pedir o código, vou pedir primeiro que a IA atue como analista, com comandos como "Leia esta especificação e aponte o que está faltando para o uso real" e "Liste todas as suposições que você precisou fazer para escrever este código". Depois, vou conferir o resultado por conta própria, rodando o código e testando com casos reais, porque a própria IA também errou algumas afirmações durante este trabalho.

## Parte 7: divisão do trabalho

| Parte | Responsável principal | Participação do outro integrante |
|---|---|---|
| Parte 1 | Rony | [ ] |
| Parte 2 | Rony (calcularConsumo e calcularEncargos) e Germano (calcularTarifa e gerarFatura) | [ ] |
| Parte 3 | [ ] | [ ] |
| Partes 4 a 6 | [ ] | [ ] |
