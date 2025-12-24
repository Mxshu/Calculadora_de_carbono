/**
 * ui.js - Manipulação de interface e manipuladores de interação do usuário
 * Manipula a alternância do estado readonly para entrada de distância com base na caixa de seleção
 */

document.addEventListener('DOMContentLoaded', () => {
  // Obter referências à caixa de seleção e entrada de distância
  const manualDistanceCheckbox = document.getElementById('manual-distance');
  const distanceInput = document.getElementById('distance');

  // Função para atualizar o estado readonly da entrada de distância
  function toggleDistanceInput() {
    if (manualDistanceCheckbox.checked) {
      // Se a caixa de seleção estiver marcada, desbloqueie a entrada (remova readonly)
      distanceInput.removeAttribute('readonly');
      distanceInput.focus();
    } else {
      // Se a caixa de seleção estiver desmarcada, bloqueie a entrada (adicione readonly)
      distanceInput.setAttribute('readonly', '');
      distanceInput.value = ''; // Limpar o valor ao alternar de volta para automático
    }
  }

  // Ouvir as mudanças da caixa de seleção
  manualDistanceCheckbox.addEventListener('change', toggleDistanceInput);
});
