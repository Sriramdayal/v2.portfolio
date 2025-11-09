// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Select your model here
const MODEL_NAME = "llama3.2:1b"; // or "llama-fitcoach:latest"

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
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
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
    console.error("❌ Error connecting to Ollama:", error);
    res
      .status(500)
      .json({ error: "Failed to connect to Ollama or process the request." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio AI server is live on http://localhost:${PORT}`);
  console.log(`🌐 Public access (via ngrok): https://01e8f9d1a8d1.ngrok-free.app`);
});
