// ReaderLine: Encapsulates all reader line DOM and styling logic

class ReaderLine {
  static READER_LINE_CLASS = "cmVhZGVyLWxpbmU";
  static FOCUS_MODE_CLASS = "cmVhZGVyLWxpbmU--focus";

  constructor(storage) {
    this._storage = storage;
    this._el = null;
  }

  /**
   * Initialize: create/find element, set up event listeners
   */
  init() {
    this._createOrFindElement();
    this._loadAndApply();
    this._setupMouseMove();
    this._setupStorageListener();
  }

  /**
   * Create the reader line element if it doesn't exist
   * @private
   */
  _createOrFindElement() {
    this._el = document.querySelector(`.${ReaderLine.READER_LINE_CLASS}`);

    if (!this._el) {
      this._el = document.createElement("div");
      this._el.setAttribute("class", ReaderLine.READER_LINE_CLASS);
      document.querySelector("body").appendChild(this._el);
    }
  }

  /**
   * Load current settings and apply to the element
   * @private
   */
  _loadAndApply() {
    this._storage.getAll().then((data) => {
      const color = data[STORAGE_KEYS.COLOR] ?? DEFAULTS.COLOR;
      const height = data[STORAGE_KEYS.HEIGHT] ?? DEFAULTS.HEIGHT;
      const enabled = data[STORAGE_KEYS.ENABLED] ?? DEFAULTS.ENABLED;
      const mode = data[STORAGE_KEYS.MODE] ?? DEFAULTS.MODE;
      this._apply(color, height, enabled, mode);
    });
  }

  /**
   * Apply settings to element style and classes
   * @private
   */
  _apply(color, height, enabled, mode) {
    this._el.style.setProperty('--pseudo-background', color);
    this._el.style.backgroundColor = color;
    this._el.style.height = height + "px";
    this._el.style.display = enabled ? "block" : "none";

    if (mode === "line") {
      this._el.classList.remove(ReaderLine.FOCUS_MODE_CLASS);
    } else if (mode === "focus") {
      this._el.classList.add(ReaderLine.FOCUS_MODE_CLASS);
    }
  }

  /**
   * Set up mousemove listener for tracking
   * @private
   */
  _setupMouseMove() {
    document.addEventListener("mousemove", (e) => this._onMouseMove(e));
  }

  /**
   * Handle mousemove: position element at cursor y-position
   * @private
   */
  _onMouseMove(e) {
    const height = parseInt(this._el.style.height);
    this._el.style.top = e.clientY - (height / 2) + "px";
  }

  /**
   * Listen for storage changes and update element
   * @private
   */
  _setupStorageListener() {
    this._storage.onChange(() => {
      this._loadAndApply();
    });
  }
}
