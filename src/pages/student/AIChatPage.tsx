import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

const AIChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    setError("");

    const userMessage: ChatMessage = {
      role: "user",
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/ai/ask",
        { message: userMessage.content },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: response.data.reply || "No response received.",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setError("Unable to get a response from the AI assistant. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">AI Chatbot</h1>
          <p className="text-muted-foreground mt-2">
            Ask the AlumniConnect assistant for career guidance, interview tips, resume help, and student support.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Card className="shadow-xl rounded-2xl">
          <CardContent className="flex flex-col h-[75vh] p-4 md:p-6">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">
                  Start the conversation with a question for the AI assistant.
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-3xl px-4 py-3 rounded-3xl shadow-sm ${
                      msg.role === "user"
                        ? "ml-auto bg-primary text-white rounded-br-none"
                        : "mr-auto bg-slate-100 text-slate-900 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1 capitalize">
                      {msg.role === "user" ? "You" : "Assistant"}
                    </p>
                    <p className="whitespace-pre-wrap break-words text-sm">{msg.content}</p>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex gap-3 items-center">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={isSending || !newMessage.trim()}>
                  {isSending ? "Sending…" : "Send"}
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
