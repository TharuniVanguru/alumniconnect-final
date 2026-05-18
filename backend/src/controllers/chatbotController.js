const axios = require("axios");

// ===============================
// CHATBOT
// ===============================
const chatbot = async (req, res) => {
  try {
    const { message } = req.body;

    // VALIDATION
    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const hfModel =
      process.env.HF_MODEL ||
      "openai/gpt-oss-120b:fastest";
    const hfUrl =
      process.env.HF_URL ||
      "https://router.huggingface.co/v1/chat/completions";

    const response = await axios.post(
      hfUrl,
      {
        model: hfModel,
        messages: [
          {
            role: "system",
            content: `You are AlumniConnect AI Assistant. Help students with career guidance, MERN roadmap, interview preparation, resume building, AI/ML guidance, and project ideas. Always respond in plain, user-friendly English without markdown, headings, tables, code blocks, or special symbols. Use short sentences and simple bullet-style lines only when needed.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawReply =
      response.data?.choices?.[0]?.message?.content ||
      "No response generated";

    const aiReply = rawReply
      .replace(/```[\s\S]*?```/g, "")
      .replace(/^>\s*/gm, "")
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/[*_~`]/g, "")
      .replace(/\|/g, " ")
      .replace(/^[-+*]\s+/gm, "• ")
      .replace(/\s*\n{2,}\s*/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

    return res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.log(
      "HUGGING FACE ERROR:",
      error.response?.data || error.response?.status || error.message
    );

    return res.status(500).json({
      message: "AI Server Error",
    });
  }
};

// EXPORT
module.exports = {
  chatbot,
};