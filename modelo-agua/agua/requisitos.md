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
