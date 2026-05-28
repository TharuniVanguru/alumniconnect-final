const axios =
  require("axios");


// =====================================
// CLEAN AI RESPONSE
// =====================================
const cleanResponse =
  (text) => {

    if (!text) {

      return "No response generated";

    }


    return text

      // REMOVE CODE BLOCKS
      .replace(
        /```[\s\S]*?```/g,
        ""
      )

      // REMOVE HEADINGS
      .replace(
        /^#{1,6}\s*/gm,
        ""
      )

      // REMOVE BLOCKQUOTES
      .replace(
        /^>\s*/gm,
        ""
      )

      // REMOVE MARKDOWN SYMBOLS
      .replace(
        /[*_~`]/g,
        ""
      )

      // REMOVE TABLE PIPES
      .replace(
        /\|/g,
        " "
      )

      // CLEAN BULLETS
      .replace(
        /^[-+*]\s+/gm,
        "• "
      )

      // REMOVE EXTRA SPACES
      .replace(
        /[ \t]{2,}/g,
        " "
      )

      // REMOVE EXTRA NEWLINES
      .replace(
        /\n{3,}/g,
        "\n\n"
      )

      .trim();

  };


// =====================================
// RESPONSE CATEGORY
// =====================================
const detectCategory =
  (message) => {

    const lowerMsg =
      message.toLowerCase();


    if (
      lowerMsg.includes(
        "resume"
      )
    ) {

      return "resume";

    }


    if (
      lowerMsg.includes(
        "interview"
      )
    ) {

      return "interview";

    }


    if (
      lowerMsg.includes(
        "roadmap"
      )
    ) {

      return "roadmap";

    }


    if (
      lowerMsg.includes(
        "project"
      )
    ) {

      return "projects";

    }


    if (
      lowerMsg.includes(
        "mern"
      )
    ) {

      return "mern";

    }


    if (

      lowerMsg.includes("ai") ||

      lowerMsg.includes("ml")

    ) {

      return "ai_ml";

    }


    if (

      lowerMsg.includes("career") ||

      lowerMsg.includes("job")

    ) {

      return "career";

    }


    return "general";

  };


// =====================================
// SYSTEM PROMPT
// =====================================
const generateSystemPrompt =
  () => {

    return `

You are AlumniConnect AI Assistant.

Your role:
- Help students with career guidance
- Help with MERN roadmap
- Help with AI/ML roadmap
- Help with interview preparation
- Help with resume building
- Suggest project ideas
- Help with coding guidance
- Help students use the AlumniConnect platform
- Help students connect with mentors
- Help with placement preparation
- Help with internship guidance

Rules:
- Always answer in simple English
- Keep answers beginner friendly
- Avoid markdown
- Avoid headings
- Avoid tables
- Avoid code blocks unless user asks
- Give step-by-step guidance
- Keep answers practical
- Motivate students positively
- Give concise but informative responses
- If user asks roadmap, give clear phases
- If user asks interview questions, provide examples
- If user asks projects, suggest beginner to advanced ideas

`;

  };


// =====================================
// QUICK PREDEFINED RESPONSES
// =====================================
const predefinedResponses = {

  greeting:
    "Hello! I am your AlumniConnect AI Assistant. I can help you with career guidance, resume building, interview preparation, MERN stack roadmap, AI/ML learning, projects, mentorship guidance, and placement preparation.",

  help:
    "You can ask me about MERN roadmap, AI roadmap, interview preparation, resume tips, project ideas, coding help, internships, placements, and mentorship guidance.",

};


// =====================================
// CHATBOT CONTROLLER
// =====================================
const chatbot =
  async (req, res) => {

    try {

      // =================================
      // GET MESSAGE
      // =================================
      const {

        message,

        history = [],

      } = req.body;


      // =================================
      // VALIDATION
      // =================================
      if (!message) {

        return res.status(400).json({

          success: false,

          message:
            "Message is required",

        });

      }


      // =================================
      // QUICK RESPONSES
      // =================================
      const lowerMessage =
        message.toLowerCase();


      if (

        ["hi", "hello", "hey"]
          .includes(lowerMessage)

      ) {

        return res.status(200).json({

          success: true,

          category:
            "greeting",

          userMessage:
            message,

          reply:
            predefinedResponses.greeting,

        });

      }


      if (
        lowerMessage === "help"
      ) {

        return res.status(200).json({

          success: true,

          category:
            "help",

          userMessage:
            message,

          reply:
            predefinedResponses.help,

        });

      }


      // =================================
      // ENV VARIABLES
      // =================================
      const hfModel =

        process.env.HF_MODEL ||

        "openai/gpt-oss-120b:fastest";


      const hfUrl =

        process.env.HF_URL ||

        "https://router.huggingface.co/v1/chat/completions";


      // =================================
      // BUILD CHAT HISTORY
      // =================================
      const messages = [

        {

          role: "system",

          content:
            generateSystemPrompt(),

        },

        ...history,

        {

          role: "user",

          content:
            message,

        },

      ];


      // =================================
      // API REQUEST
      // =================================
      const response =
        await axios.post(

          hfUrl,

          {

            model:
              hfModel,

            messages,

            temperature:
              0.7,

            max_tokens:
              700,

          },

          {

            headers: {

              Authorization:

                `Bearer ${process.env.HF_TOKEN}`,

              "Content-Type":

                "application/json",

            },

            timeout:
              30000,

          }

        );


      // =================================
      // EXTRACT RESPONSE
      // =================================
      const rawReply =

        response.data?.choices?.[0]
          ?.message?.content ||

        "No response generated";


      // =================================
      // CLEAN RESPONSE
      // =================================
      const aiReply =
        cleanResponse(
          rawReply
        );


      // =================================
      // CATEGORY
      // =================================
      const category =
        detectCategory(
          message
        );


      // =================================
      // SUCCESS RESPONSE
      // =================================
      return res.status(200).json({

        success: true,

        category,

        userMessage:
          message,

        reply:
          aiReply,

      });

    }

    catch (error) {

      console.log(

        "HUGGING FACE ERROR:",

        error.response?.data ||

        error.response?.status ||

        error.message

      );


      // =================================
      // FALLBACK
      // =================================
      return res.status(500).json({

        success: false,

        message:
          "AI Server Error",

        fallback:

          "The AI assistant is temporarily unavailable. Please try again later.",

      });

    }

  };


// =====================================
// EXPORTS
// =====================================
module.exports = {

  chatbot,

};