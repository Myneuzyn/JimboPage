// script.js

// --------------------------------------------------------------------------------
// Preencher estatisticas
document.addEventListener("DOMContentLoaded", async function () {
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3oXI1EJ4R1_6v01yvr192h5ZKTCzb5pWBgtNMNYLY3eUDcpHkY7ukunSW8agGtxe_q5M9pmW9dykN/pub?output=csv";

  const linhas = await fetchCSV(csvUrl);
  const dados = parseCSV(linhas);

  preencherMaisVitorias(dados, "mais-vitorias");
  preencherMaisDerrotas(dados, "mais-derrotas");
  preencherMaisPartidas(dados, "mais-partidas");
  preencherRivalidade(dados, "rivalidade");
  preencherMaiorWinstreak(dados, "maior-winstreak");
  preencherMaiorLosestreak(dados, "maior-losestreak");
});
// --------------------------------------------------------------------------------

// --------------------------------------------------------------------------------
// --- Funções utilitárias ---
async function fetchCSV(url) {
  const response = await fetch(url);
  const texto = await response.text();
  return texto.trim().split("\n");
}

function parseCSV(linhas) {
  return linhas.slice(1).map(linha => linha.split(",")); // Remove cabeçalho
}
// --------------------------------------------------------------------------------

function preencherMaisVitorias(dados, idElemento) {
  let maiorValor = -Infinity;
  let nome = "";
  const indiceColunaVitorias = 1;

  for (const linha of dados) {
    const valor = parseInt(linha[indiceColunaVitorias]);
    if (!isNaN(valor) && valor > maiorValor) {
      maiorValor = valor;
      nome = linha[0];
    }
  }

  document.getElementById(idElemento).innerText = `${nome} (${maiorValor})`;
}
function preencherMaisDerrotas(dados, idElemento) {
  let maiorValor = -Infinity;
  let nome = "";
  const indiceColunaDerrotas = 2;

  for (const linha of dados) {
    const valor = parseInt(linha[indiceColunaDerrotas]);
    if (!isNaN(valor) && valor > maiorValor) {
      maiorValor = valor;
      nome = linha[0];
    }
  }

  document.getElementById(idElemento).innerText = `${nome} (${maiorValor})`;
}

function preencherMaisPartidas(dados, idElemento) {
  let maiorTotal = -Infinity;
  let nome = "";
  const indiceColunaVitorias = 1;
  const indiceColunaDerrotas = 2;

  for (const linha of dados) {
    let total = 0;
    for (const col of [indiceColunaVitorias, indiceColunaDerrotas]) {
      const val = parseInt(linha[col]);
      if (!isNaN(val)) {
        total += val;
      }
    }

    if (total > maiorTotal) {
      maiorTotal = total;
      nome = linha[0];
    }
  }

  document.getElementById(idElemento).innerText = `${nome} (${maiorTotal})`;
}

function preencherRivalidade(dados, idElemento) {
  const contagem = {};

  for (const linha of dados) {
    const player1 = linha[4];
    const player2 = linha[5];
    const winner = linha[6];

    if (!player1 || !player2 || !winner) continue;

    const loser = (player1 === winner) ? player2 : player1;
    const chave = `${loser}->${winner}`;

    contagem[chave] = (contagem[chave] || 0) + 1;
  }

  // Encontrar a chave com o maior número de derrotas
  let maiorChave = "";
  let maiorValor = -Infinity;

  for (const chave in contagem) {
    if (contagem[chave] > maiorValor) {
      maiorValor = contagem[chave];
      maiorChave = chave;
    }
  }

  if (maiorChave) {
    document.getElementById(idElemento).innerText = `${maiorChave} (${maiorValor} derrotas)`;
  } else {
    document.getElementById(idElemento).innerText = `-`;
  }
}

function preencherMaiorWinstreak(dados, idElemento) {
  // Ordenar por data (coluna 8)
  dados.sort((a, b) => new Date(a[8]) - new Date(b[8]));

  const streaks = {};       // streaks[player] = { atual: n, max: n }
  let maiorStreak = 0;
  let jogadorMaiorStreak = "";

  for (const linha of dados) {
    const vencedor = linha[6];
    if (!vencedor) continue;

    // Inicializa se necessário
    if (!streaks[vencedor]) streaks[vencedor] = { atual: 0, max: 0 };

    // Atualiza o streak de vitória
    streaks[vencedor].atual += 1;
    streaks[vencedor].max = Math.max(streaks[vencedor].max, streaks[vencedor].atual);

    // Zera streak dos outros
    for (const jogador in streaks) {
      if (jogador !== vencedor) {
        streaks[jogador].atual = 0;
      }
    }

    // Atualiza o maior streak
    if (streaks[vencedor].max > maiorStreak) {
      maiorStreak = streaks[vencedor].max;
      jogadorMaiorStreak = vencedor;
    }
  }

  document.getElementById(idElemento).innerText = `${jogadorMaiorStreak} (${maiorStreak})`;
}

function preencherMaiorLosestreak(dados, idElemento) {
  // Ordenar por data (coluna 4)
  dados.sort((a, b) => new Date(a[8]) - new Date(b[8]));

  const streaks = {};
  let maiorStreak = 0;
  let jogadorMaiorStreak = "";

  for (const linha of dados) {
    const player1 = linha[4];
    const player2 = linha[5];
    const winner = linha[6];
    if (!player1 || !player2 || !winner) continue;

    const loser = (winner === player1) ? player2 : player1;

    // Inicializa se necessário
    if (!streaks[loser]) streaks[loser] = { atual: 0, max: 0 };
    streaks[loser].atual += 1;
    streaks[loser].max = Math.max(streaks[loser].max, streaks[loser].atual);

    // Zera streak de quem venceu
    if (!streaks[winner]) streaks[winner] = { atual: 0, max: 0 };
    streaks[winner].atual = 0;

    // Atualiza maior streak
    if (streaks[loser].max > maiorStreak) {
      maiorStreak = streaks[loser].max;
      jogadorMaiorStreak = loser;
    }
  }

  document.getElementById(idElemento).innerText = `${jogadorMaiorStreak} (${maiorStreak})`;
}


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