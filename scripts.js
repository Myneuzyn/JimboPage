// script.js

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