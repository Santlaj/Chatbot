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

    const prompt = `You are a helpful assistant. Answer the following user query in a maximum of 1 sentence only. Do NOT give examples, analogies, lists, or long explanations. Provide a concise and meaningful answer.
    Question: ${userMessage}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.MODEL}:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            thinkingConfig: {
              thinkingBudget: 0
            },
            maxOutputTokens: 40
          }
        })
      }
    );

    const data = await response.json();
    const botReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t understand that.";

    

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "Facing error while processiong your request." });
  }
});

// // ✅ Start server
// app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
