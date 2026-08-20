const dotenv = require("dotenv");

dotenv.config();

const express = require("express");

const connectDB = require("./config/db");
const ragRoutes = require("./routes/ragRoutes");

const app = express();


// Middleware
app.use(express.json());


// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillForge AI Service is running",
  });
});


// RAG routes
app.use("/api/ai", ragRoutes);


// Start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`AI Service running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start AI Service:");
    console.error(error);
    process.exit(1);
  }
};

startServer();