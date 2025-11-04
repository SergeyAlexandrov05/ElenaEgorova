/** @type {import('continue').Config} */
const config = {
  // Подключаем только локальную модель — никакого облака!
  models: [
    {
      title: "Phi3 (Local) — для HTML/CSS/JS",
      provider: "ollama",
      model: "phi3:3.8b",
      contextLength: 4096,
      apiKey: "", // не нужен для Ollama
    }
  ],

  // Отключаем всё, что требует интернета
  allowAnonymousTelemetry: false,
  disableAutoUpdate: true,
  disableAnonymousMetrics: true,

  // Указываем, какие файлы AI должен "знать" целиком
  context: [
    {
      name: "Вся структура проекта",
      description: "Все HTML, CSS и JS файлы",
      include: ["**/*.html", "**/*.css", "**/*.js"],
      exclude: [".git/**", "node_modules/**", ".vscode/**"]
    }
  ],

  // Настройки поведения
  systemMessage: "Ты — эксперт по веб-разработке. Помогай создавать чистый, рабочий HTML/CSS/JS. Используй русский язык в пояснениях, но код пиши на английском (как положено).",

  // Автоматически предлагать улучшения в редакторе
  enableAutoContext: true,
};
export default config;