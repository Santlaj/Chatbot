import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Serve frontend files from "public" folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname + "/public"));

// ✅ API route for chatbot
app.post("/api/chat", async (req, res) => {
  const { userMessage } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.MODEL}:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: {
            thinkingConfig: {
              thinkingBudget: 0
            }
          }
        })
      }
    );

    const data = await response.json();
    res.json(data); // send Gemini's response back to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start server
app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
