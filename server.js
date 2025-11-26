import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// السماح لأي موقع بالاتصال (مثل Google Sites)
app.use(cors({
  origin: "*",
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// استخدم متغير البيئة من Render
const API_KEY = process.env.API_KEY;

// Route اختبار
app.get("/", (req, res) => {
  res.send("DeepSeek server is running");
});

// Route الشات
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      "https://api.deepseek.com/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
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

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Server error" });
  }
});

// Render required PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DeepSeek server running on port ${PORT}`);
});
