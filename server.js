// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Choose which model to answer portfolio questions
const MODEL_NAME = "llama3.2:1b"; // or "llama-fitcoach:latest"

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `You General purpose chatbot.Answer the questions as best as you can.\n
User: ${prompt}`,
        stream: false,
      }),
    });

    const data = await response.json();
    res.json({ response: data.response.trim() });
  } catch (error) {
    console.error("❌ Error connecting to Ollama:", error);
    res.status(500).json({ error: "Failed to connect to Ollama." });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Portfolio AI server running on http://localhost:${PORT}`)
);
