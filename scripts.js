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
  // Ordena os dados por data (coluna 8)
  dados.sort((a, b) => new Date(a[7]) - new Date(b[7]));

  const streaks = {};
  let maiorStreak = 0;
  let jogadorMaiorStreak = "";

  for (const linha of dados) {
    const partidaId = linha[3];
    const player1 = linha[4];
    const player2 = linha[5];
    const winner = linha[6];

    if (!player1 || !player2 || !winner) {
      console.log(`⚠️ Pulando partida ${partidaId} por dados ausentes.`);
      continue;
    }

    console.log(`📦 Partida ${partidaId}: ${player1} vs ${player2} | Vencedor: ${winner}`);

    // Inicializa participantes
    for (const player of [player1, player2]) {
      if (!streaks[player]) {
        streaks[player] = { atual: 0, max: 0 };
        console.log(`→ Inicializando streak para ${player}`);
      }
    }

    // Verifica se winner está inicializado corretamente
    if (!streaks[winner]) {
      streaks[winner] = { atual: 0, max: 0 };
    }

    // Atualiza streak do vencedor
    streaks[winner].atual += 1;
    streaks[winner].max = Math.max(streaks[winner].max, streaks[winner].atual);
    console.log(`✔ ${winner} venceu. Streak atual: ${streaks[winner].atual}, Máxima: ${streaks[winner].max}`);

    if (streaks[winner].max > maiorStreak) {
      maiorStreak = streaks[winner].max;
      jogadorMaiorStreak = winner;
      console.log(`🔥 Novo recorde: ${winner} com ${maiorStreak} vitórias seguidas`);
    }

    // Zera streak do perdedor
    const loser = winner === player1 ? player2 : player1;
    streaks[loser].atual = 0;
    console.log(`✘ ${loser} perdeu. Streak resetada.`);
    console.log("--------");
  }

  console.log(`🏆 Maior winstreak: ${jogadorMaiorStreak} (${maiorStreak})`);
  document.getElementById(idElemento).innerText = `${jogadorMaiorStreak} (${maiorStreak})`;
}


function preencherMaiorLosestreak(dados, idElemento) {
  // Ordena os dados por data (coluna 8)
  dados.sort((a, b) => new Date(a[7]) - new Date(b[7]));

  const streaks = {};
  let maiorStreak = 0;
  let jogadorMaiorStreak = "";

  for (const linha of dados) {
    const partidaId = linha[3];
    const player1 = linha[4];
    const player2 = linha[5];
    const winner = linha[6];

    if (!player1 || !player2 || !winner) {
      console.log(`⚠️ Pulando partida ${partidaId} por dados ausentes.`);
      continue;
    }

    console.log(`📦 Partida ${partidaId}: ${player1} vs ${player2} | Vencedor: ${winner}`);

    // Inicializa participantes
    for (const player of [player1, player2]) {
      if (!streaks[player]) {
        streaks[player] = { atual: 0, max: 0 };
        console.log(`→ Inicializando streak para ${player}`);
      }
    }

    // Perdedor
    const loser = winner === player1 ? player2 : player1;

    // Atualiza streak do perdedor
    streaks[loser].atual += 1;
    streaks[loser].max = Math.max(streaks[loser].max, streaks[loser].atual);
    console.log(`✘ ${loser} perdeu. Losestreak atual: ${streaks[loser].atual}, Máxima: ${streaks[loser].max}`);

    if (streaks[loser].max > maiorStreak) {
      maiorStreak = streaks[loser].max;
      jogadorMaiorStreak = loser;
      console.log(`❄️ Novo recorde: ${loser} com ${maiorStreak} derrotas seguidas`);
    }

    // Zera streak do vencedor
    streaks[winner].atual = 0;
    console.log(`✔ ${winner} venceu. Losestreak resetada.`);
    console.log("--------");
  }

  console.log(`🥶 Maior losestreak: ${jogadorMaiorStreak} (${maiorStreak})`);
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

  // Só desabilita se o valor selecionado for válido (diferente de "-")
  if (selectedValue && selectedValue !== "-") {
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

  const perdedorSelect = document.getElementById("select-d087");
  const vencedorSelect = document.getElementById("select-4333");

  const perdedor = perdedorSelect.value;
  const vencedor = vencedorSelect.value;

  if (perdedor === vencedor) {
    alert("O perdedor e o vencedor não podem ser a mesma pessoa!");
    return;
  }

  const botao = document.getElementById("botao-enviar");

  botao.disabled = true;
  botao.textContent = "Enviando...";

  // Cria o corpo do JSON para enviar
  const data = {
    action: "addMatch",
    player1: vencedor,
    player2: perdedor,
    winner: vencedor,
    date: new Date().toISOString()
  };

  console.log("📤 Enviando dados:", data);

  // Substitua essa URL pela URL do seu Web App
  const endpoint = "https://vercel-proxy-myneuzyn.vercel.app/api/proxy";

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.text())
    .then(text => {
      console.log("✅ Resposta do servidor:", text);
      alert(`Resultado enviado com sucesso! ${vencedor} venceu ${perdedor}.`);

      // Limpa os selects
      perdedorSelect.selectedIndex = 0;
      vencedorSelect.selectedIndex = 0;

      // Atualiza o estado das opções após reset
      updateOptions(select1, select2);
      updateOptions(select2, select1);
    })
    .catch(error => {
      console.error("❌ Erro ao enviar:", error);
      alert("Erro ao enviar resultado!");

    });

  // Atualiza o botão
  botao.textContent = "Enviar";
  botao.disabled = false;
});


// --------------------------------------------------------------------------------