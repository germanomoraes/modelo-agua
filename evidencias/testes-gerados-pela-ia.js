const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularConsumo, calcularTarifa, calcularEncargos, gerarFatura } = require('../src/agua.js');

// --- Testes para calcularConsumo ---
test('calcularConsumo - consumo normal sem volta do hidrômetro', () => {
  assert.strictEqual(calcularConsumo(100, 150), 50);
});

test('calcularConsumo - volta do hidrômetro (leitura atual menor que anterior)', () => {
  assert.strictEqual(calcularConsumo(9990, 10), 20);
});

test('calcularConsumo - entradas inválidas lançam RangeError', () => {
  assert.throws(() => calcularConsumo(-1, 100), RangeError);
  assert.throws(() => calcularConsumo(100, 10000), RangeError);
});

// --- Testes para calcularTarifa ---
test('calcularTarifa - consumo na faixa 1 (taxa mínima)', () => {
  assert.strictEqual(calcularTarifa(5), 15.00);
  assert.strictEqual(calcularTarifa(10), 15.00);
});

test('calcularTarifa - consumo na faixa 2', () => {
  assert.strictEqual(calcularTarifa(11), 17.35); 
  assert.strictEqual(calcularTarifa(20), 38.50); 
});

test('calcularTarifa - consumo na faixa 3', () => {
  assert.strictEqual(calcularTarifa(21), 41.65); 
  assert.strictEqual(calcularTarifa(30), 70.00);
});

test('calcularTarifa - consumo negativo lança RangeError', () => {
  assert.throws(() => calcularTarifa(-5), RangeError);
});

// --- Testes para calcularEncargos ---
test('calcularEncargos - pagamento em dia não gera encargos', () => {
  assert.deepStrictEqual(calcularEncargos(100, '2026-10-15', '2026-10-15'), { multa: 0, juros: 0 });
});

test('calcularEncargos - vencimento no fim de semana prorroga para segunda-feira', () => {
  // 17/10/2026 é sábado, prorroga para 19/10/2026 (segunda)
  assert.deepStrictEqual(calcularEncargos(100, '2026-10-17', '2026-10-19'), { multa: 0, juros: 0 });
});

test('calcularEncargos - pagamento com 1 dia de atraso', () => {
  assert.deepStrictEqual(calcularEncargos(100, '2026-10-15', '2026-10-16'), { multa: 2.00, juros: 0.03 });
});

test('calcularEncargos - formato de data inválido lança TypeError', () => {
  assert.throws(() => calcularEncargos(100, '15-10-2026', '2026-10-15'), TypeError);
});

// --- Testes para gerarFatura ---
test('gerarFatura - sem data de pagamento (apenas o valor da água)', () => {
  const dados = { nome: 'João', leituraAnterior: 100, leituraAtual: 130 };
  const resultado = gerarFatura(dados);
  assert.deepStrictEqual(resultado, { 
    nome: 'João', consumo: 30, valorAgua: 70.00, multa: 0, juros: 0, total: 70.00 
  });
});

test('gerarFatura - com pagamento atrasado gera encargos', () => {
  const dados = { nome: 'Maria', leituraAnterior: 100, leituraAtual: 130, vencimento: '2026-10-15', pagamento: '2026-10-16' };
  const resultado = gerarFatura(dados);
  assert.deepStrictEqual(resultado, { 
    nome: 'Maria', consumo: 30, valorAgua: 70.00, multa: 1.40, juros: 0.02, total: 71.42 
  });
});

test('gerarFatura - dados nulos lançam TypeError', () => {
  assert.throws(() => gerarFatura(null), TypeError);
});