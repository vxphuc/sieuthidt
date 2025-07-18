// Ghi log ra file log.txt (trong môi trường NodeJS hoặc backend), còn trên frontend thì dùng localStorage
const logs = [];

function writeLogToLocalStorage(message) {
  logs.push(message);
  localStorage.setItem("app_logs", JSON.stringify(logs.slice(-500))); // lưu tối đa 500 dòng
}

['log', 'error', 'warn', 'info'].forEach(method => {
  const original = console[method];
  console[method] = function (...args) {
    const time = new Date().toISOString();
    const formatted = `[${time}] [${method.toUpperCase()}] ${args.join(" ")}`;

    // Ghi vào localStorage
    writeLogToLocalStorage(formatted);

    // In ra console như thường
    original.apply(console, args);
  };
});
