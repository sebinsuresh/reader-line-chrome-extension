// PopupController: Manages the popup UI and storage synchronization

class PopupController {
  constructor(storage) {
    this._storage = storage;
    this._enabledEl = null;
    this._colorEl = null;
    this._opacityEl = null;
    this._opacityValueEl = null;
    this._heightEl = null;
    this._modeEls = null;
  }

  /**
   * Initialize popup on DOM ready
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this._bindElements();
      this._loadSettings();
      this._bindEvents();
    });
  }

  /**
   * Cache all DOM element references
   * @private
   */
  _bindElements() {
    this._enabledEl = document.getElementById('enabled');
    this._colorEl = document.getElementById('color');
    this._opacityEl = document.getElementById('opacity');
    this._opacityValueEl = document.getElementById('opacity-value');
    this._heightEl = document.getElementById('height');
    this._modeEls = document.querySelectorAll('input[name="mode"]');
  }

  /**
   * Load saved settings from storage and populate form elements
   * @private
   */
  _loadSettings() {
    this._storage.getAll().then((data) => {
      // Load color and opacity
      if (data[STORAGE_KEYS.COLOR]) {
        const { hex, alpha } = PopupController.rgbaToInputs(data[STORAGE_KEYS.COLOR]);
        this._colorEl.value = hex;
        this._opacityEl.value = alpha;
        this._updateOpacityDisplay();
      }

      // Load height
      if (typeof data[STORAGE_KEYS.HEIGHT] === 'number') {
        this._heightEl.value = data[STORAGE_KEYS.HEIGHT];
      }

      // Load enabled state
      if (typeof data[STORAGE_KEYS.ENABLED] === 'boolean') {
        this._enabledEl.checked = data[STORAGE_KEYS.ENABLED];
      }

      // Load mode
      if (data[STORAGE_KEYS.MODE]) {
        const modeInput = document.querySelector(`input[name="mode"][value="${data[STORAGE_KEYS.MODE]}"]`);
        if (modeInput) modeInput.checked = true;
      }
    });
  }

  /**
   * Attach event listeners to all form controls
   * @private
   */
  _bindEvents() {
    // Enabled toggle
    this._enabledEl.addEventListener('change', () => {
      this._storage.set({ [STORAGE_KEYS.ENABLED]: this._enabledEl.checked });
    });

    // Color input
    this._colorEl.addEventListener('input', () => this._saveColor());

    // Opacity range
    this._opacityEl.addEventListener('input', () => {
      this._updateOpacityDisplay();
      this._saveColor();
    });

    // Height number input
    this._heightEl.addEventListener('input', () => {
      const val = parseInt(this._heightEl.value, 10);
      if (val >= 1) {
        this._storage.set({ [STORAGE_KEYS.HEIGHT]: val });
      }
    });

    // Mode radio buttons
    this._modeEls.forEach((el) => {
      el.addEventListener('change', () => {
        this._storage.set({ [STORAGE_KEYS.MODE]: el.value });
      });
    });
  }

  /**
   * Save combined color and opacity as rgba string to storage
   * @private
   */
  _saveColor() {
    const rgba = PopupController.inputsToRgba(this._colorEl.value, parseFloat(this._opacityEl.value));
    this._storage.set({ [STORAGE_KEYS.COLOR]: rgba });
  }

  /**
   * Update opacity display percentage label
   * @private
   */
  _updateOpacityDisplay() {
    this._opacityValueEl.textContent = Math.round(this._opacityEl.value * 100) + '%';
  }

  /**
   * Convert rgba string to {hex, alpha} for form inputs
   * @static
   * @param {string} rgba - e.g., "rgba(255, 0, 0, 0.5)"
   * @returns {Object} {hex, alpha}
   */
  static rgbaToInputs(rgba) {
    const m = rgba.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
    if (!m) return { hex: '#000000', alpha: 0.15 };
    const r = parseInt(m[1]);
    const g = parseInt(m[2]);
    const b = parseInt(m[3]);
    const alpha = m[4] !== undefined ? parseFloat(m[4]) : 1;
    const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
    return { hex, alpha };
  }

  /**
   * Convert hex and alpha to rgba string for storage
   * @static
   * @param {string} hex - e.g., "#FF0000"
   * @param {number} alpha - 0-1
   * @returns {string} rgba string
   */
  static inputsToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
