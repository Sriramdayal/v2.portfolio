// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ollama server config
const MODEL_NAME = "llama3.2:1b"; 
const OLLAMA_API_URL = "http://100.20.92.101:11434/api/generate"; // your Render server IP

// Root endpoint
app.get("/", (req, res) => {
  res.send("✅ Ollama Portfolio API is running successfully!");
});

// Chat endpoint
app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `You are Sriram Dayal's personal AI assistant on his portfolio website. 
Provide friendly, short, and accurate answers about his work, background, and AI interests.

User: ${prompt}
Assistant:`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("Empty response from Ollama.");
    }

    res.json({ response: data.response.trim() });
  } catch (error) {
    console.error("❌ Error connecting to Ollama:", error.message);
    res.status(500).json({ error: "Failed to connect to Ollama or process the request." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio AI server is live on http://localhost:${PORT}`);
});
