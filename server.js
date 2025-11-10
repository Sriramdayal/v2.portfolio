import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

// 🧩 Allow requests from your GitHub Pages frontend
app.use(
  cors({
    origin: [
      "https://sriramdayal.github.io", // ✅ your GitHub Pages domain
      "http://localhost:3000" // for local testing
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

// 🧠 Ollama Configuration
const MODEL_NAME = "llama3.2:1b";
const OLLAMA_API_URL =
  process.env.OLLAMA_API_URL ||
  "https://abcd1234.ngrok-free.app/api/generate"; // 🔁 update this every time you restart ngrok

// ✅ Root test endpoint
app.get("/", (req, res) => {
  res.send("✅ Ollama Portfolio AI backend is running successfully!");
});

// 💬 Chat endpoint
app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `Respond concisely and professionally to visitors’ questions.

User: ${prompt}
Assistant:`,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error(`❌ Ollama API returned status ${response.status}`);
      const errorText = await response.text();
      return res.status(response.status).send({ error: errorText });
    }

    const data = await response.json();

    if (!data.response) {
      throw new Error("Empty response from Ollama.");
    }

    res.json({ response: data.response.trim() });
  } catch (error) {
    console.error("🚨 Error connecting to Ollama:", error.message);
    res.status(500).json({
      error: "Failed to connect to Ollama or process the request.",
      details: error.message,
    });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio AI backend live at: http://localhost:${PORT}`);
  console.log(`🧠 Forwarding requests to Ollama: ${OLLAMA_API_URL}`);
});
