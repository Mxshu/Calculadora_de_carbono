/**
 * ui.js - Interface manipulation and user interaction handlers
 * Handles toggling readonly state for distance input based on checkbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // Get references to the checkbox and distance input
  const manualDistanceCheckbox = document.getElementById('manual-distance');
  const distanceInput = document.getElementById('distance');

  // Function to update the readonly state of the distance input
  function toggleDistanceInput() {
    if (manualDistanceCheckbox.checked) {
      // If checkbox is checked, unlock the input (remove readonly)
      distanceInput.removeAttribute('readonly');
      distanceInput.focus();
    } else {
      // If checkbox is unchecked, lock the input (add readonly)
      distanceInput.setAttribute('readonly', '');
      distanceInput.value = ''; // Clear the value when switching back to auto
    }
  }

  // Listen for checkbox changes
  manualDistanceCheckbox.addEventListener('change', toggleDistanceInput);
});
