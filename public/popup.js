// Helpers: convert between "rgba(r, g, b, a)" and {hex, alpha}
function rgbaToInputs(rgba) {
  const m = rgba.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
  if (!m) return { hex: '#000000', alpha: 0.15 };
  const r = parseInt(m[1]);
  const g = parseInt(m[2]);
  const b = parseInt(m[3]);
  const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  return { hex, alpha };
}

function inputsToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

document.addEventListener('DOMContentLoaded', () => {
  const enabledEl      = document.getElementById('enabled');
  const colorEl        = document.getElementById('color');
  const opacityEl      = document.getElementById('opacity');
  const opacityValueEl = document.getElementById('opacity-value');
  const heightEl       = document.getElementById('height');
  const modeEls        = document.querySelectorAll('input[name="mode"]');

  function updateOpacityDisplay() {
    opacityValueEl.textContent = Math.round(opacityEl.value * 100) + '%';
  }

  function saveColor() {
    const rgba = inputsToRgba(colorEl.value, parseFloat(opacityEl.value));
    chrome.storage.local.set({ color: rgba });
  }

  // Load saved settings and apply to UI
  chrome.storage.local.get(['color', 'height', 'enabled', 'mode']).then(data => {
    if (data.color) {
      const { hex, alpha } = rgbaToInputs(data.color);
      colorEl.value = hex;
      opacityEl.value = alpha;
      updateOpacityDisplay();
    }

    if (typeof data.height === 'number') {
      heightEl.value = data.height;
    }

    if (typeof data.enabled === 'boolean') {
      enabledEl.checked = data.enabled;
    }

    if (data.mode) {
      const modeInput = document.querySelector(`input[name="mode"][value="${data.mode}"]`);
      if (modeInput) modeInput.checked = true;
    }
  });

  // Save on change
  enabledEl.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: enabledEl.checked });
  });

  colorEl.addEventListener('input', saveColor);

  opacityEl.addEventListener('input', () => {
    updateOpacityDisplay();
    saveColor();
  });

  heightEl.addEventListener('input', () => {
    const val = parseInt(heightEl.value, 10);
    if (val >= 1) chrome.storage.local.set({ height: val });
  });

  modeEls.forEach(el => {
    el.addEventListener('change', () => {
      chrome.storage.local.set({ mode: el.value });
    });
  });
});
