// script.js

// --------------------------------------------------------------------------------
// Preencher os valores do stats
document.addEventListener("DOMContentLoaded", function () {
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vS3oXI1EJ4R1_6v01yvr192h5ZKTCzb5pWBgtNMNYLY3eUDcpHkY7ukunSW8agGtxe_q5M9pmW9dykN/pub?output=csv")
    .then(response => response.text())
    .then(csv => {
      const linhas = csv.trim().split("\n");

      // Maior vitórias
      let nomeMaiorVitorias = "";
      let maiorVitorias = -Infinity;

      for (let i = 1; i < linhas.length; i++) {
        const colunas = linhas[i].split(",");
        const nome = colunas[0];
        const vitorias = parseInt(colunas[1]);

        if (!isNaN(vitorias) && vitorias > maiorVitorias) {
          maiorVitorias = vitorias;
          nomeMaiorVitorias = nome;
        }
      }

      document.getElementById("mais-vitorias").innerText = `${nomeMaiorVitorias} (${maiorVitorias})`;

      // Maior derrotas
      let nomeMaiorDerrotas = "";
      let maiorDerrotas = -Infinity;

      for (let i = 1; i < linhas.length; i++) {
        const colunas = linhas[i].split(",");
        const nome = colunas[0];
        const derrotas = parseInt(colunas[2]);

        if (!isNaN(derrotas) && derrotas > maiorDerrotas) {
          maiorDerrotas = derrotas;
          nomeMaiorDerrotas = nome;
        }
      }

      document.getElementById("mais-derrotas").innerText = `${nomeMaiorDerrotas} (${maiorDerrotas})`;
    });
});
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
//Impedir o dropbox de repetir o player
const select1 = document.getElementById('select-d087');
const select2 = document.getElementById('select-4333');

function updateOptions(changedSelect, otherSelect) {
  const selectedValue = changedSelect.value;

  // Reabilita todas as opções do outro select
  Array.from(otherSelect.options).forEach(option => {
    option.disabled = false;
  });

  // Desabilita a opção selecionada no outro select
  if (selectedValue) {
    const optionToDisable = Array.from(otherSelect.options).find(
      option => option.value === selectedValue
    );
    if (optionToDisable) {
      optionToDisable.disabled = true;
    }
  }
}

select1.addEventListener('change', () => updateOptions(select1, select2));
select2.addEventListener('change', () => updateOptions(select2, select1));
// --------------------------------------------------------------------------------


// --------------------------------------------------------------------------------
// Sobrescrever a ação do botão
document.getElementById("botao-enviar").addEventListener("click", function (e) {
  e.preventDefault(); // impede o envio padrão

  const perdedor = document.getElementById("select-d087").value;
  const vencedor = document.getElementById("select-4333").value;

  if (perdedor === vencedor) {
    alert("O perdedor e o vencedor não podem ser a mesma pessoa!");
    return;
  }

  // Aqui você pode usar fetch/AJAX ou salvar localmente (ex: Google Sheets API, backend, etc.)
  console.log("Perdedor:", perdedor);
  console.log("Vencedor:", vencedor);

  alert("Resultado enviado!");
});
// --------------------------------------------------------------------------------