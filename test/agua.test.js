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
// Responsável: Rony

test("CC01: leituras zeradas", () => {
  assert.equal(calcularConsumo(0, 0), 0);
});

test("CC02: leituras iguais não é volta do hidrômetro", () => {
  assert.equal(calcularConsumo(500, 500), 0);
});

test("CC03: volta do hidrômetro (9990 -> 10)", () => {
  assert.equal(calcularConsumo(9990, 10), 20);
});

test("CC04: fronteira da volta (9999 -> 0)", () => {
  assert.equal(calcularConsumo(9999, 0), 1);
});

test("CC05: consumo máximo (0 -> 9999)", () => {
  assert.equal(calcularConsumo(0, 9999), 9999);
});

// CC06 a CC08: a especificação não define entradas inválidas.
// Decisão da dupla: lançar erro.
test("CC06: leitura negativa lança erro", () => {
  assert.throws(() => calcularConsumo(-1, 10));
});

test("CC07: leitura decimal lança erro", () => {
  assert.throws(() => calcularConsumo(10.5, 20));
});

test("CC08: leitura acima de 9999 lança erro", () => {
  assert.throws(() => calcularConsumo(0, 10000));
});

// ===== Testes de calcularTarifa (mínimo de 5) =====
// Responsável: Germano 

test("CT01: consumo zero paga a taxa mínima", () => {
  assert.equal(calcularTarifa(0), 15); 
});

test("CT02: fronteira da 1ª faixa (10 m³)", () => {
  assert.equal(calcularTarifa(10), 15); 
});

test("CT03: primeiro m³ da 2ª faixa (11 m³)", () => {
  assert.equal(calcularTarifa(11), 17.35); 
});

test("CT04: fronteira da 2ª faixa (20 m³)", () => {
  assert.equal(calcularTarifa(20), 38.5); 
});

test("CT05: primeiro m³ da 3ª faixa (21 m³)", () => {
  assert.equal(calcularTarifa(21), 41.65); 
});

test("CT06: exemplo da especificação (22 m³)", () => {
  assert.equal(calcularTarifa(22), 44.8);
});

// CT07 e CT08: a especificação não define entradas inválidas.
// Decisão da dupla: lançar erro (igual ao calcularConsumo).
test("CT07: consumo negativo lança erro", () => {
  assert.throws(() => calcularTarifa(-1));
});

test("CT08: consumo decimal lança erro", () => {
  assert.throws(() => calcularTarifa(2.5));
});

// ===== Testes de calcularEncargos (mínimo de 5) =====
// Responsável: Rony

test("CE01: pago no dia do vencimento", () => {
  assert.deepEqual(calcularEncargos(100, "2026-10-15", "2026-10-15"), { multa: 0, juros: 0 });
});

test("CE02: pago antes do vencimento", () => {
  assert.deepEqual(calcularEncargos(100, "2026-10-15", "2026-10-14"), { multa: 0, juros: 0 });
});

test("CE03: 1 dia de atraso", () => {
  assert.deepEqual(calcularEncargos(100, "2026-10-15", "2026-10-16"), { multa: 2, juros: 0.03 });
});

test("CE04: 10 dias de atraso", () => {
  assert.deepEqual(calcularEncargos(100, "2026-10-15", "2026-10-25"), { multa: 2, juros: 0.33 });
});

test("CE05: vence no sábado, paga na segunda (sem encargos)", () => {
  assert.deepEqual(calcularEncargos(100, "2026-10-17", "2026-10-19"), { multa: 0, juros: 0 });
});

test("CE06: vence no sábado, paga na terça (3 dias a partir do vencimento original)", () => {
  assert.deepEqual(calcularEncargos(100, "2026-10-17", "2026-10-20"), { multa: 2, juros: 0.1 });
});

test("CE07: vence no domingo, paga na terça (2 dias)", () => {
  assert.deepEqual(calcularEncargos(100, "2026-10-18", "2026-10-20"), { multa: 2, juros: 0.07 });
});

test("CE08: juros de 0,165 arredondam para 0,17 (meio para cima)", () => {
  assert.deepEqual(calcularEncargos(50, "2026-10-15", "2026-10-25"), { multa: 1, juros: 0.17 });
});

test("CE09: multa de 0,535 arredonda para 0,54 (meio para cima)", () => {
  assert.deepEqual(calcularEncargos(26.75, "2026-10-15", "2026-10-16"), { multa: 0.54, juros: 0.01 });
});

test("CE10: atraso na virada de ano", () => {
  assert.deepEqual(calcularEncargos(100, "2026-12-31", "2027-01-04"), { multa: 2, juros: 0.13 });
});

test("CE11: atraso em ano bissexto", () => {
  assert.deepEqual(calcularEncargos(100, "2028-02-28", "2028-03-01"), { multa: 2, juros: 0.07 });
});

test("CE12: vence na sexta, paga no sábado (prorrogação só vale se o vencimento é fim de semana)", () => {
  assert.deepEqual(calcularEncargos(100, "2026-10-16", "2026-10-17"), { multa: 2, juros: 0.03 });
});

test("CE13: valor zero com atraso não gera encargos", () => {
  assert.deepEqual(calcularEncargos(0, "2026-10-15", "2026-10-20"), { multa: 0, juros: 0 });
});

// ===== Testes de gerarFatura (mínimo de 5) =====
// Responsável: Germano 

test("GF01: sem pagamento, fatura sem encargos", () => {
  assert.deepEqual(
    gerarFatura({ nome: "Ana", leituraAnterior: 100, leituraAtual: 130, vencimento: "2026-10-15" }),
    { nome: "Ana", consumo: 30, valorAgua: 70, multa: 0, juros: 0, total: 70 }
  );
});

test("GF02: pagamento em dia, sem encargos", () => {
  assert.deepEqual(
    gerarFatura({ nome: "Ana", leituraAnterior: 100, leituraAtual: 130, vencimento: "2026-10-15", pagamento: "2026-10-15" }),
    { nome: "Ana", consumo: 30, valorAgua: 70, multa: 0, juros: 0, total: 70 }
  );
});

test("GF03: pagamento com 1 dia de atraso", () => {
  assert.deepEqual(
    gerarFatura({ nome: "Ana", leituraAnterior: 100, leituraAtual: 130, vencimento: "2026-10-15", pagamento: "2026-10-16" }),
    { nome: "Ana", consumo: 30, valorAgua: 70, multa: 1.4, juros: 0.02, total: 71.42 }
  );
});

test("GF04: hidrômetro que deu a volta (9990 -> 10)", () => {
  assert.deepEqual(
    gerarFatura({ nome: "Ana", leituraAnterior: 9990, leituraAtual: 10, vencimento: "2026-10-15" }),
    { nome: "Ana", consumo: 20, valorAgua: 38.5, multa: 0, juros: 0, total: 38.5 }
  );
});

// GF05: a especificação não diz o que fazer com pagamento vazio.
// Decisão da dupla: lançar erro.
test("GF05: pagamento como texto vazio lança erro", () => {
  assert.throws(() =>
    gerarFatura({ nome: "Ana", leituraAnterior: 100, leituraAtual: 130, vencimento: "2026-10-15", pagamento: "" })
  );
});