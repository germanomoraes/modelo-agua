'use strict';

/**
 * Gestão de Água da Associação Comunitária do Sítio Lagoa Seca
 * Módulo: cálculo da fatura mensal de água.
 *
 * Os cálculos em dinheiro são feitos em centavos (inteiros) para evitar
 * erros de ponto flutuante e só convertidos para reais na saída.
 */

const LEITURA_MAXIMA = 9999;
const VOLTA_HIDROMETRO = LEITURA_MAXIMA + 1; // 10000

// Tarifas em centavos
const TAXA_MINIMA = 1500;
const FAIXA_1_LIMITE = 10;
const FAIXA_2_LIMITE = 20;
const PRECO_FAIXA_2 = 235;
const PRECO_FAIXA_3 = 315;

const MS_POR_DIA = 24 * 60 * 60 * 1000;

function validarLeitura(valor, nome) {
  if (!Number.isInteger(valor) || valor < 0 || valor > LEITURA_MAXIMA) {
    throw new RangeError(`${nome} deve ser um inteiro entre 0 e ${LEITURA_MAXIMA}`);
  }
}

/** Converte "AAAA-MM-DD" em timestamp UTC (meia-noite), validando a data. */
function paraTimestamp(texto, nome) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!m) {
    throw new TypeError(`${nome} deve estar no formato "AAAA-MM-DD"`);
  }
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const ts = Date.UTC(ano, mes - 1, dia);
  const d = new Date(ts);
  if (d.getUTCFullYear() !== ano || d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia) {
    throw new RangeError(`${nome} não é uma data válida: ${texto}`);
  }
  return ts;
}

/** Divisão inteira arredondando "meio para cima" (para valores não negativos). */
function dividirArredondando(numerador, denominador) {
  return Math.floor((2 * numerador + denominador) / (2 * denominador));
}

function emReais(centavos) {
  return centavos / 100;
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
  return VOLTA_HIDROMETRO - leituraAnterior + leituraAtual;
}

/**
 * RF04–RF07: valor da água em reais, por faixas.
 */
function calcularTarifa(consumo) {
  if (!Number.isInteger(consumo) || consumo < 0) {
    throw new RangeError('consumo deve ser um inteiro não negativo');
  }

  let centavos = TAXA_MINIMA;

  if (consumo > FAIXA_1_LIMITE) {
    const naFaixa2 = Math.min(consumo, FAIXA_2_LIMITE) - FAIXA_1_LIMITE;
    centavos += naFaixa2 * PRECO_FAIXA_2;
  }
  if (consumo > FAIXA_2_LIMITE) {
    centavos += (consumo - FAIXA_2_LIMITE) * PRECO_FAIXA_3;
  }

  return emReais(centavos);
}

/**
 * RF08–RF12: multa (2%) e juros (0,033% ao dia corrido) em caso de atraso.
 */
function calcularEncargos(valor, vencimento, pagamento) {
  if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < 0) {
    throw new RangeError('valor deve ser um número não negativo');
  }

  const venc = paraTimestamp(vencimento, 'vencimento');
  const pag = paraTimestamp(pagamento, 'pagamento');

  // RF09: vencimento em fim de semana prorroga para a segunda-feira seguinte.
  const diaSemana = new Date(venc).getUTCDay(); // 0 = domingo, 6 = sábado
  let limite = venc;
  if (diaSemana === 6) limite = venc + 2 * MS_POR_DIA;
  else if (diaSemana === 0) limite = venc + 1 * MS_POR_DIA;

  // RF08
  if (pag <= limite) {
    return { multa: 0, juros: 0 };
  }

  // RF10: dias corridos contados a partir do vencimento original.
  const diasAtraso = Math.round((pag - venc) / MS_POR_DIA);
  const valorCentavos = Math.round(valor * 100);

  // multa = valor * 2%  |  juros = valor * 0,033% * dias  (0,033% = 33/100000)
  const multa = dividirArredondando(valorCentavos * 2, 100);
  const juros = dividirArredondando(valorCentavos * diasAtraso * 33, 100000);

  return { multa: emReais(multa), juros: emReais(juros) };
}

/**
 * RF13–RF14: monta a fatura completa do morador.
 */
function gerarFatura(dados) {
  if (dados === null || typeof dados !== 'object') {
    throw new TypeError('dados deve ser um objeto');
  }
  const { nome, leituraAnterior, leituraAtual, vencimento, pagamento } = dados;

  const consumo = calcularConsumo(leituraAnterior, leituraAtual);
  const valorAgua = calcularTarifa(consumo);

  let multa = 0;
  let juros = 0;
  if (pagamento !== undefined && pagamento !== null) {
    ({ multa, juros } = calcularEncargos(valorAgua, vencimento, pagamento));
  }

  const total = emReais(
    Math.round(valorAgua * 100) + Math.round(multa * 100) + Math.round(juros * 100)
  );

  return { nome, consumo, valorAgua, multa, juros, total };
}

module.exports = { calcularConsumo, calcularTarifa, calcularEncargos, gerarFatura };