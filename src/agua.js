'use strict';

/**
 * Converte "AAAA-MM-DD" em dias inteiros desde 1970-01-01 (UTC).
 * Trabalhar em UTC evita erros por fuso horário e horário de verão.
 */
function dataParaDias(texto) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!m) {
    throw new TypeError(`Data inválida: "${texto}". Use o formato AAAA-MM-DD.`);
  }
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const ms = Date.UTC(ano, mes - 1, dia);
  const d = new Date(ms);
  // Rejeita datas inexistentes, como 2026-02-30
  if (d.getUTCFullYear() !== ano || d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia) {
    throw new RangeError(`Data inexistente: "${texto}".`);
  }
  return ms / 86400000;
}

/** Dia da semana de um número de dias desde 1970 (0 = domingo ... 6 = sábado). */
function diaDaSemana(dias) {
  return new Date(dias * 86400000).getUTCDay();
}

/** Divisão inteira arredondada "meio para cima" (só com inteiros, sem erro de ponto flutuante). */
function dividirArredondando(numerador, denominador) {
  return Math.floor((2 * numerador + denominador) / (2 * denominador));
}

function validarLeitura(valor, nome) {
  if (!Number.isInteger(valor) || valor < 0 || valor > 9999) {
    throw new RangeError(`${nome} deve ser um inteiro de 0 a 9999. Recebido: ${valor}`);
  }
}

/**
 * RF01–RF03: consumo em m³, considerando a volta do hidrômetro (9999 -> 0).
 */
function calcularConsumo(leituraAnterior, leituraAtual) {
  validarLeitura(leituraAnterior, 'leituraAnterior');
  validarLeitura(leituraAtual, 'leituraAtual');

  if (leituraAtual >= leituraAnterior) {
    return leituraAtual - leituraAnterior;
  }
  // Completou uma volta: o hidrômetro tem 10000 posições (0 a 9999)
  return 10000 - leituraAnterior + leituraAtual;
}

/**
 * RF08–RF12: multa de 2% e juros de 0,033% ao dia, ambos arredondados
 * separadamente ao centavo (meio para cima).
 * Retorna { multa, juros } em reais.
 */
function calcularEncargos(valor, vencimento, pagamento) {
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < 0) {
    throw new RangeError(`Valor inválido: ${valor}`);
  }

  const diasVenc = dataParaDias(vencimento);
  const diasPag = dataParaDias(pagamento);

  // RF09: vencimento em fim de semana prorroga o prazo para a segunda-feira
  let limite = diasVenc;
  const dow = diaDaSemana(diasVenc);
  if (dow === 6) limite += 2;      // sábado -> segunda
  else if (dow === 0) limite += 1; // domingo -> segunda

  // RF08: pagamento dentro do prazo, sem encargos
  if (diasPag <= limite) {
    return { multa: 0, juros: 0 };
  }

  // RF10: dias corridos contados a partir do vencimento ORIGINAL
  const diasAtraso = diasPag - diasVenc;

  const centavos = Math.round(valor * 100);

  // multa = 2% do valor        -> centavos * 2 / 100
  const multaCentavos = dividirArredondando(centavos * 2, 100);
  // juros = 0,033% por dia     -> centavos * 33 * dias / 100000
  const jurosCentavos = dividirArredondando(centavos * 33 * diasAtraso, 100000);

  return {
    multa: multaCentavos / 100,
    juros: jurosCentavos / 100,
  };
}

module.exports = { calcularConsumo, calcularEncargos };