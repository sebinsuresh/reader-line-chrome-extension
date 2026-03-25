// Initialize services
const storage = new StorageService();
const readerLine = new ReaderLine(storage);
readerLine.init();

// Set up keyboard command registry
const commands = new CommandRegistry();

// Register height adjustment commands
commands.register('[', () => {
  storage.getAll().then((data) => {
    // Only allow adjustment if enabled
    if (!data[STORAGE_KEYS.ENABLED]) return;

    const currentHeight = data[STORAGE_KEYS.HEIGHT] ?? DEFAULTS.HEIGHT;
    const newHeight = Math.max(1, currentHeight - HEIGHT_STEP);
    storage.set({ [STORAGE_KEYS.HEIGHT]: newHeight });
  });
});

commands.register(']', () => {
  storage.getAll().then((data) => {
    // Only allow adjustment if enabled
    if (!data[STORAGE_KEYS.ENABLED]) return;

    const currentHeight = data[STORAGE_KEYS.HEIGHT] ?? DEFAULTS.HEIGHT;
    const newHeight = Math.min(500, currentHeight + HEIGHT_STEP);
    storage.set({ [STORAGE_KEYS.HEIGHT]: newHeight });
  });
});

// Start listening for keyboard commands
commands.listen();
