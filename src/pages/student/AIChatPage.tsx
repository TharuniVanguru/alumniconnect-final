import {
  useEffect,
  useRef,
  useState,
} from "react";

import api from "@/utils/api";

import { Header }
  from "@/components/layout/Header";

import { Button }
  from "@/components/ui/button";

import { Input }
  from "@/components/ui/input";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import {

  Bot,
  Send,
  Loader2,
  Sparkles,
  User,
  Trash2,
  Clock3,
  Copy,
  CheckCircle2,

} from "lucide-react";


// ==========================================
// TYPES
// ==========================================
interface ChatMessage {

  role:
    | "user"
    | "assistant";

  content: string;

  createdAt: string;

}


// ==========================================
// COMPONENT
// ==========================================
const AIChatPage = () => {

  // ========================================
  // STATES
  // ========================================
  const [

    messages,
    setMessages,

  ] = useState<
    ChatMessage[]
  >([]);

  const [

    newMessage,
    setNewMessage,

  ] = useState("");

  const [

    isSending,
    setIsSending,

  ] = useState(false);

  const [

    error,
    setError,

  ] = useState("");

  const [

    copiedIndex,
    setCopiedIndex,

  ] = useState<number | null>(
    null
  );


  // ========================================
  // REFS
  // ========================================
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );


  // ========================================
  // USER INFO
  // ========================================
  const userInfo =
    JSON.parse(

      localStorage.getItem(
        "userInfo"
      ) || "{}"

    );


  // ========================================
  // AUTO FOCUS
  // ========================================
  useEffect(() => {

    inputRef.current?.focus();

  }, []);


  // ========================================
  // LOAD CHAT HISTORY
  // ========================================
  useEffect(() => {

    const saved =
      localStorage.getItem(
        "ai_chat_history"
      );

    if (saved) {

      setMessages(
        JSON.parse(saved)
      );

    }

  }, []);


  // ========================================
  // SAVE CHAT HISTORY
  // ========================================
  useEffect(() => {

    localStorage.setItem(

      "ai_chat_history",

      JSON.stringify(messages)

    );

  }, [messages]);


  // ========================================
  // AUTO SCROLL
  // ========================================
  useEffect(() => {

    bottomRef.current?.scrollIntoView({

      behavior:
        "smooth",

    });

  }, [messages]);


  // ========================================
  // SEND MESSAGE
  // ========================================
  const sendMessage =
    async () => {

      if (
        !newMessage.trim()
      ) return;


      const userMessage:
        ChatMessage = {

        role: "user",

        content:
          newMessage.trim(),

        createdAt:
          new Date().toISOString(),

      };


      // ====================================
      // UPDATE UI
      // ====================================
      setMessages(
        (prev) => [

          ...prev,

          userMessage,

        ]
      );

      setNewMessage("");

      setIsSending(true);

      setError("");


      try {

        // ==================================
        // AI API
        // ==================================
        const response =
          await api.post(

            "/ai/ask",

            {

              message:
                userMessage.content,

            }

          );


        // ==================================
        // RESPONSE
        // ==================================
        const aiMessage:
          ChatMessage = {

          role:
            "assistant",

          content:

            response.data
              ?.reply ||

            "No response from AI.",

          createdAt:
            new Date().toISOString(),

        };


        // ==================================
        // UPDATE CHAT
        // ==================================
        setMessages(
          (prev) => [

            ...prev,

            aiMessage,

          ]
        );

      }

      catch (error: any) {

        console.log(
          "AI CHAT ERROR:",
          error
        );

        setError(

          error?.response?.data
            ?.message ||

          "Failed to connect with AI assistant."

        );

      }

      finally {

        setIsSending(false);

      }

    };


  // ========================================
  // ENTER KEY
  // ========================================
  const handleKeyDown =
    (
      event:
        React.KeyboardEvent<HTMLInputElement>
    ) => {

      if (

        event.key === "Enter" &&

        !event.shiftKey

      ) {

        event.preventDefault();

        sendMessage();

      }

    };


  // ========================================
  // CLEAR CHAT
  // ========================================
  const clearChat =
    () => {

      setMessages([]);

      localStorage.removeItem(
        "ai_chat_history"
      );

    };


  // ========================================
  // COPY MESSAGE
  // ========================================
  const copyMessage =
    async (
      text: string,
      index: number
    ) => {

      try {

        await navigator.clipboard.writeText(
          text
        );

        setCopiedIndex(index);

        setTimeout(() => {

          setCopiedIndex(null);

        }, 2000);

      }

      catch (error) {

        console.log(error);

      }

    };


  // ========================================
  // QUICK PROMPTS
  // ========================================
  const suggestions = [

    "How do I improve my resume?",

    "Give me DSA interview roadmap",

    "Suggest MERN stack project ideas",

    "How can I crack placements?",

    "Teach me system design basics",

    "Generate LinkedIn summary",

  ];


  // ========================================
  // UI
  // ========================================
  return (

    <div className="min-h-screen bg-background">

      <Header />

      <main className="container mx-auto px-4 py-6">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>

            <div className="flex items-center gap-3 mb-3">

              <div className="h-14 w-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">

                <Bot className="h-7 w-7 text-white" />

              </div>

              <div>

                <h1 className="text-3xl font-bold">

                  AI Career Assistant

                </h1>

                <p className="text-muted-foreground">

                  Smart career guidance powered by AI

                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-2">

              <Badge variant="secondary">

                Resume Help

              </Badge>

              <Badge variant="secondary">

                Interview Prep

              </Badge>

              <Badge variant="secondary">

                Career Guidance

              </Badge>

              <Badge variant="secondary">

                Coding Support

              </Badge>

            </div>

          </div>


          {messages.length > 0 && (

            <Button

              variant="outline"

              onClick={clearChat}

            >

              <Trash2 className="h-4 w-4 mr-2" />

              Clear Chat

            </Button>

          )}

        </div>


        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}
        {error && (

          <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl">

            {error}

          </div>

        )}


        {/* ================================= */}
        {/* CHAT CARD */}
        {/* ================================= */}
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">

          <CardContent className="p-0 flex flex-col h-[80vh]">

            {/* ============================= */}
            {/* CHAT AREA */}
            {/* ============================= */}
            <div className="flex-1 overflow-y-auto bg-muted/20 p-6">

              {messages.length === 0 ? (

                <div className="h-full flex flex-col items-center justify-center text-center">

                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">

                    <Sparkles className="h-12 w-12 text-primary" />

                  </div>

                  <h2 className="text-3xl font-bold mb-3">

                    Welcome {userInfo?.name || "Student"} 👋

                  </h2>

                  <p className="text-muted-foreground max-w-2xl mb-10 leading-7">

                    Ask anything related to placements,
                    resumes, coding interviews, projects,
                    internships, career guidance,
                    system design, or higher studies.

                  </p>

                  {/* QUICK PROMPTS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">

                    {suggestions.map(
                      (
                        suggestion,
                        index
                      ) => (

                        <button

                          key={index}

                          onClick={() =>
                            setNewMessage(
                              suggestion
                            )
                          }

                          className="p-5 rounded-2xl bg-background border hover:border-primary hover:bg-primary/5 transition-all text-left"

                        >

                          <p className="font-medium">

                            {suggestion}

                          </p>

                        </button>

                      )
                    )}

                  </div>

                </div>

              ) : (

                <div className="space-y-6">

                  {messages.map(
                    (
                      msg,
                      index
                    ) => (

                      <div

                        key={index}

                        className={`flex ${
                          msg.role ===
                          "user"

                            ? "justify-end"

                            : "justify-start"
                        }`}

                      >

                        <div
                          className={`max-w-3xl rounded-3xl px-5 py-4 shadow-sm ${
                            msg.role ===
                            "user"

                              ? "bg-primary text-white rounded-br-none"

                              : "bg-background border rounded-bl-none"
                          }`}
                        >

                          {/* TOP */}
                          <div className="flex items-center justify-between mb-3">

                            <div className="flex items-center gap-2">

                              <div
                                className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                  msg.role ===
                                  "user"

                                    ? "bg-white/20"

                                    : "bg-primary/10"
                                }`}
                              >

                                {msg.role ===
                                "user" ? (

                                  <User className="h-4 w-4" />

                                ) : (

                                  <Bot className="h-4 w-4 text-primary" />

                                )}

                              </div>

                              <div>

                                <p className="font-semibold text-sm">

                                  {msg.role ===
                                  "user"

                                    ? "You"

                                    : "AI Assistant"}

                                </p>

                                <div className="flex items-center gap-1 text-xs opacity-70">

                                  <Clock3 className="h-3 w-3" />

                                  {new Date(
                                    msg.createdAt
                                  ).toLocaleTimeString(
                                    [],
                                    {

                                      hour:
                                        "2-digit",

                                      minute:
                                        "2-digit",

                                    }
                                  )}

                                </div>

                              </div>

                            </div>


                            {/* COPY */}
                            {msg.role ===
                              "assistant" && (

                              <button

                                onClick={() =>
                                  copyMessage(
                                    msg.content,
                                    index
                                  )
                                }

                                className="opacity-70 hover:opacity-100 transition"

                              >

                                {copiedIndex ===
                                index ? (

                                  <CheckCircle2 className="h-4 w-4 text-green-500" />

                                ) : (

                                  <Copy className="h-4 w-4" />

                                )}

                              </button>

                            )}

                          </div>


                          {/* MESSAGE */}
                          <div className="whitespace-pre-wrap break-words leading-7 text-sm">

                            {msg.content}

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}


              {/* ============================= */}
              {/* LOADING */}
              {/* ============================= */}
              {isSending && (

                <div className="flex justify-start mt-5">

                  <div className="bg-background border rounded-3xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-3">

                    <Loader2 className="h-5 w-5 animate-spin text-primary" />

                    <span className="text-sm text-muted-foreground">

                      AI is generating response...

                    </span>

                  </div>

                </div>

              )}

              <div ref={bottomRef} />

            </div>


            {/* ============================= */}
            {/* INPUT */}
            {/* ============================= */}
            <div className="border-t bg-background p-4">

              <div className="flex gap-3">

                <Input

                  ref={inputRef}

                  value={newMessage}

                  onChange={(e) =>
                    setNewMessage(
                      e.target.value
                    )
                  }

                  onKeyDown={
                    handleKeyDown
                  }

                  placeholder="Ask anything about careers, coding, placements..."

                  className="h-12 rounded-xl"

                />

                <Button

                  onClick={
                    sendMessage
                  }

                  disabled={

                    isSending ||

                    !newMessage.trim()

                  }

                  className="h-12 px-6 rounded-xl"

                >

                  {isSending ? (

                    <Loader2 className="h-4 w-4 animate-spin" />

                  ) : (

                    <>

                      <Send className="h-4 w-4 mr-2" />

                      Send

                    </>

                  )}

                </Button>

              </div>

            </div>

          </CardContent>

        </Card>

      </main>

    </div>

  );

};


export default AIChatPage;