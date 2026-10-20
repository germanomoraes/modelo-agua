const { gerarFatura, calcularEncargos } = require("../src/agua.js");

// Hidrômetro trocado (novo começa do zero): o código acha que deu a volta
console.log("Troca de hidrômetro:",
  gerarFatura({ nome: "X", leituraAnterior: 5000, leituraAtual: 3, vencimento: "2026-10-15" }));

// Leitura em branco: o código aborta a fatura
try {
  gerarFatura({ nome: "X", leituraAnterior: null, leituraAtual: 120, vencimento: "2026-10-15" });
} catch (e) {
  console.log("Leitura em branco:", e.name, "-", e.message);
}

// Vencimento no Natal (sexta, 25/12), pago na segunda 28/12: cobra encargos
console.log("Feriado:", calcularEncargos(100, "2026-12-25", "2026-12-28"));

// CPF junto com os dados: não aparece na fatura
console.log("CPF:",
  gerarFatura({ nome: "X", cpf: "123.456.789-00", leituraAnterior: 100, leituraAtual: 135, vencimento: "2026-10-15" }));