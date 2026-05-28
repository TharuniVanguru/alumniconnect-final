import {
  useEffect,
  useRef,
  useState,
} from "react";

import axios from "axios";

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

} from "lucide-react";


// ==========================================
// INTERFACE
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
const AIChatPage =
  () => {

    // ======================================
    // STATES
    // ======================================
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


    // ======================================
    // REFS
    // ======================================
    const inputRef =
      useRef<HTMLInputElement | null>(
        null
      );

    const bottomRef =
      useRef<HTMLDivElement | null>(
        null
      );


    // ======================================
    // USER INFO
    // ======================================
    const userInfo =
      JSON.parse(

        localStorage.getItem(
          "userInfo"
        ) || "{}"

      );


    // ======================================
    // AUTO FOCUS
    // ======================================
    useEffect(() => {

      inputRef.current?.focus();

    }, []);


    // ======================================
    // AUTO SCROLL
    // ======================================
    useEffect(() => {

      bottomRef.current?.scrollIntoView({

        behavior:
          "smooth",

      });

    }, [messages]);


    // ======================================
    // SEND MESSAGE
    // ======================================
    const sendMessage =
      async () => {

        if (
          !newMessage.trim()
        ) return;


        setIsSending(true);

        setError("");


        // USER MESSAGE
        const userMessage:
          ChatMessage = {

          role: "user",

          content:
            newMessage.trim(),

          createdAt:
            new Date().toISOString(),

        };


        // ADD TO UI
        setMessages(
          (prev) => [

            ...prev,

            userMessage,

          ]
        );


        // CLEAR INPUT
        setNewMessage("");


        try {

          // API CALL
          const response =
            await axios.post(

              "http://localhost:5000/ai/ask",

              {

                message:
                  userMessage.content,

              },

              {

                headers: {

                  Authorization:
                    `Bearer ${userInfo.token}`,

                  "Content-Type":
                    "application/json",

                },

              }

            );


          // AI RESPONSE
          const aiMessage:
            ChatMessage = {

            role:
              "assistant",

            content:

              response.data
                ?.reply ||

              "No response received.",

            createdAt:
              new Date().toISOString(),

          };


          // UPDATE UI
          setMessages(
            (prev) => [

              ...prev,

              aiMessage,

            ]
          );

        }

        catch (err) {

          console.error(err);

          setError(

            "Unable to get response from AI assistant."

          );

        }

        finally {

          setIsSending(false);

        }

      };


    // ======================================
    // ENTER KEY
    // ======================================
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


    // ======================================
    // CLEAR CHAT
    // ======================================
    const clearChat =
      () => {

        setMessages([]);

      };


    // ======================================
    // SUGGESTIONS
    // ======================================
    const suggestions = [

      "How do I improve my resume?",

      "Give me interview preparation tips",

      "Suggest final year project ideas",

      "How can I prepare for placements?",

    ];


    // ======================================
    // UI
    // ======================================
    return (

      <div className="min-h-screen bg-background">

        <Header />

        <main className="container mx-auto px-4 py-6">

          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">

            <div>

              <div className="flex items-center gap-3 mb-2">

                <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">

                  <Bot className="h-6 w-6 text-white" />

                </div>


                <div>

                  <h1 className="text-3xl font-bold text-foreground">

                    AI Career Assistant

                  </h1>

                  <p className="text-muted-foreground">

                    Ask career questions, placement tips, resume guidance, and more.

                  </p>

                </div>

              </div>

            </div>


            {/* CLEAR BUTTON */}
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


          {/* ERROR */}
          {error && (

            <div className="mb-4 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">

              {error}

            </div>

          )}


          {/* MAIN CARD */}
          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">

            <CardContent className="flex flex-col h-[78vh] p-0">

              {/* CHAT AREA */}
              <div className="flex-1 overflow-y-auto p-5 bg-muted/20">

                {messages.length === 0 ? (

                  <div className="h-full flex flex-col items-center justify-center text-center">

                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">

                      <Sparkles className="h-10 w-10 text-primary" />

                    </div>


                    <h2 className="text-2xl font-bold mb-2">

                      Start Your AI Conversation

                    </h2>


                    <p className="text-muted-foreground max-w-xl mb-8">

                      Ask about placements, interview preparation, coding, resume building, career growth, or project ideas.

                    </p>


                    {/* SUGGESTIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">

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

                            className="p-4 rounded-2xl border bg-background hover:bg-primary/5 transition text-left"

                          >

                            <p className="text-sm font-medium">

                              {suggestion}

                            </p>

                          </button>

                        )
                      )}

                    </div>

                  </div>

                ) : (

                  <div className="space-y-5">

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
                            <div className="flex items-center gap-2 mb-2">

                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
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

                                <p className="text-sm font-semibold">

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


                            {/* MESSAGE */}
                            <p className="whitespace-pre-wrap break-words leading-7 text-sm">

                              {msg.content}

                            </p>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}


                {/* LOADING */}
                {isSending && (

                  <div className="flex justify-start mt-4">

                    <div className="bg-background border rounded-3xl rounded-bl-none px-5 py-4 shadow-sm flex items-center gap-3">

                      <Loader2 className="h-5 w-5 animate-spin text-primary" />

                      <span className="text-sm text-muted-foreground">

                        AI is thinking...

                      </span>

                    </div>

                  </div>

                )}


                {/* BOTTOM */}
                <div ref={bottomRef} />

              </div>


              {/* INPUT AREA */}
              <div className="border-t bg-background p-4">

                <div className="flex gap-3 items-center">

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

                    placeholder="Ask something about placements, coding, interviews..."

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