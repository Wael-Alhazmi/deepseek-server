import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// اكتب مفتاح DeepSeek الخاص بك هنا
const API_KEY = process.env.DEEPSEEK_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      "https://api.deepseek.com/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "أنت مساعد متخصص في دروس الجافا فقط." },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.json({ reply: "خطأ في الاتصال بالذكاء الاصطناعي." });
  }
});

app.listen(3000, () => {
  console.log("DeepSeek server running on port 3000");
});
