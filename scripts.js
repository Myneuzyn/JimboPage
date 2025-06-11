// script.js

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
