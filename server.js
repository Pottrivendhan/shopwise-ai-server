const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 ShopWise AI Server running`);
  console.log(`   ➜ http://localhost:${PORT}/api/health`);
  console.log(`   ➜ Environment: ${process.env.NODE_ENV || "development"}\n`);
});

// Graceful shutdown
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err.message);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  server.close(() => console.log("Server closed gracefully"));
});
