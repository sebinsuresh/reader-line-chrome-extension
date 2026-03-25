// Initialize popup: create services and start controller
const storage = new StorageService();
const controller = new PopupController(storage);
controller.init();
