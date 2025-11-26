import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح DeepSeek
const API_KEY = process.env.DEEPSEEK_KEY;

app.get("/", (req, res) => {
  res.send("DeepSeek server is running");
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      "https://api.deepseek.com/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "أنت مساعد ذكي متخصص حصريًا في شرح دروس الجافا فقط. " +
              "لا تجيب على أي سؤال خارج الجافا. يجب أن تكون الإجابة مختصرة جدًا ومباشرة. " +
              "عند التحية، قل: وعليكم السلام، مرحباً بكم في المدرب الرقمي! كيف أقدر أساعدك في الجافا؟"
          },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("DEEPSEEK ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
