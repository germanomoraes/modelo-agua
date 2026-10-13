// Parte 2: casos de teste escritos pela DUPLA, a partir de requisitos.md.
// Para rodar: npm test   (Node.js 18 ou superior; nenhuma biblioteca externa)

// Fixa o fuso horário de Fortaleza, para que os testes deem o mesmo resultado em qualquer computador.
process.env.TZ = "America/Fortaleza";

const test = require("node:test");
const assert = require("node:assert/strict");
const { calcularConsumo, calcularTarifa, calcularEncargos, gerarFatura } = require("../src/agua.js");

// Exemplos (podem ser mantidos e contam no total):

test("EX01: consumo simples", () => {
  assert.equal(calcularConsumo(100, 130), 30);
});

test("EX02: exemplo da especificação", () => {
  assert.deepEqual(
    gerarFatura({ nome: "José", leituraAnterior: 120, leituraAtual: 135, vencimento: "2026-10-15" }),
    { nome: "José", consumo: 15, valorAgua: 26.75, multa: 0, juros: 0, total: 26.75 }
  );
});

// ===== Testes de calcularConsumo (mínimo de 5) =====

// ===== Testes de calcularTarifa (mínimo de 5) =====

// ===== Testes de calcularEncargos (mínimo de 5) =====

// ===== Testes de gerarFatura (mínimo de 5) =====

// Pense em: valores de fronteira, arredondamento, datas, combinações de regras e entradas inválidas.
