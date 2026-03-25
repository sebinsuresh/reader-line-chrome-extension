// CommandRegistry: Simple command pattern for keyboard shortcuts
// Maps keys to handler functions and manages a single keydown listener

class CommandRegistry {
  constructor() {
    this._map = {};
  }

  /**
   * Register a key handler
   * @param {string} key - The key to listen for (e.g., '[', ']')
   * @param {Function} fn - Handler to call when key is pressed
   */
  register(key, fn) {
    this._map[key] = fn;
  }

  /**
   * Handle keydown events: check guards, then dispatch to registered handler
   * @param {KeyboardEvent} event
   */
  handle(event) {
    // Guard: don't handle keys when user is typing in a form field
    const target = event.target;
    const isEditableElement =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target.contentEditable === 'true');

    if (isEditableElement) {
      return;
    }

    // Dispatch to registered handler if key exists
    if (this._map[event.key]) {
      this._map[event.key]();
    }
  }

  /**
   * Attach keydown listener to document
   */
  listen() {
    document.addEventListener('keydown', (event) => this.handle(event));
  }
}
