

const fontSelector = document.getElementById('fontSelector');
const variantSelector = document.getElementById('variantSelector');
const italicToggle = document.getElementById('italicToggle');
const textEditor = document.getElementById('textEditor');
const resetButton = document.getElementById('resetButton');
const saveButton = document.getElementById('saveButton');

// Load JSON data
fetch('punt.json')
  .then(response => response.json())
  .then(data => initializeEditor(data));

function initializeEditor(data) {
  populateFontSelector(data);
  loadSavedSettings(data);

  fontSelector.addEventListener('change', () => updateVariantSelector(data));
  variantSelector.addEventListener('change', updateItalicToggle);
  italicToggle.addEventListener('click', toggleItalic);
  textEditor.addEventListener('input', saveSettings);
  saveButton.addEventListener('click', saveSettings);
  resetButton.addEventListener('click', resetSettings);
}

function populateFontSelector(data) {
  Object.keys(data).forEach(font => {
    const option = document.createElement('option');
    option.value = font;
    option.textContent = font;
    fontSelector.appendChild(option);
  });
  updateVariantSelector(data);
}

function updateVariantSelector(data) {
  const selectedFont = fontSelector.value;
  const variants = Object.keys(data[selectedFont]);
  
  variantSelector.innerHTML = '';
  variants.forEach(variant => {
    const option = document.createElement('option');
    option.value = variant;
    option.textContent = variant;
    variantSelector.appendChild(option);
  });
  
  updateItalicToggle();
  applyFontSettings();
}

function updateItalicToggle() {
  const selectedVariant = variantSelector.value;
  italicToggle.disabled = !selectedVariant.includes('italic');
  applyFontSettings();
}

function toggleItalic() {
  italicToggle.textContent = italicToggle.textContent === 'Italic' ? 'Normal' : 'Italic';
  applyFontSettings();
}

function applyFontSettings() {
  const selectedFont = fontSelector.value;
  const selectedVariant = variantSelector.value;
  const isItalic = italicToggle.textContent === 'Italic';
  
  const fontUrl = isItalic ? `${selectedVariant}italic` : selectedVariant;
  const fontLink = document.createElement('link');
  fontLink.href = `https://fonts.googleapis.com/css2?family=${selectedFont}:wght@${selectedVariant}&display=swap`;
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
  
  textEditor.style.fontFamily = selectedFont;
  textEditor.style.fontWeight = selectedVariant;
  textEditor.style.fontStyle = isItalic ? 'italic' : 'normal';
}

function saveSettings() {
  localStorage.setItem('text', textEditor.value);
  localStorage.setItem('font', fontSelector.value);
  localStorage.setItem('variant', variantSelector.value);
  localStorage.setItem('italic', italicToggle.textContent === 'Italic');
}

function loadSavedSettings(data) {
  const savedText = localStorage.getItem('text') || '';
  const savedFont = localStorage.getItem('font') || Object.keys(data)[0];
  const savedVariant = localStorage.getItem('variant') || '400';
  const savedItalic = localStorage.getItem('italic') === 'true';
  
  textEditor.value = savedText;
  fontSelector.value = savedFont;
  variantSelector.value = savedVariant;
  italicToggle.textContent = savedItalic ? 'Italic' : 'Normal';

  updateVariantSelector(data);
  applyFontSettings();
}

function resetSettings() {
  localStorage.removeItem('text');
  localStorage.removeItem('font');
  localStorage.removeItem('variant');
  localStorage.removeItem('italic');
  location.reload();
}

