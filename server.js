import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve frontend files

// Your local Ollama model
const MODEL_NAME = "llama3.2:1b";

// Root check
app.get("/ping", (req, res) => {
  res.send("✅ Ollama Portfolio AI is running!");
});

// Ask endpoint
app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `Your name is Jarvis, Give concise and helpful answers.Adapt your communication style based on the user's preferences. If the user seems formal, respond formally; if they are casual, be more relaxed. Always be respectful and professional.
        User: ${prompt}
        Assistant:`,
        stream: false,
      }),
    });

    const data = await response.json();
    res.json({ response: data.response.trim() });
  } catch (error) {
    console.error("❌ Ollama connection error:", error);
    res.status(500).json({ error: "Failed to connect to Ollama." });
  }
});

// Run server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌐 Use ngrok to expose: ngrok http ${PORT}`);
});
