import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ExternalLink, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

interface Source {
  title: string;
  url?: string | null;
}

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  sources?: Source[];
}

interface ChatWindowProps {
  variant?: "page" | "widget";
}

const initialMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I am the MEA Assistant. Ask me about MEA resources, Mechanical Engineering curriculum, timetables, slot clashes, DAMP, ASC navigation, or where to verify course/instructor details.",
};

const suggestions = [
  "How do I check if two slots clash?",
  "Where is the 2024 onwards ME curriculum?",
  "Where should I verify current instructors?",
  "What is DAMP?",
];

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getChatbotEndpoint = () => {
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");
  return apiBaseUrl ? `${apiBaseUrl}/chatbot/ask` : "/chatbot/ask";
};

const renderMessage = (content: string) => {
  const lines = content.split("\n");
  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
};

const ChatWindow = ({ variant = "page" }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const endpoint = useMemo(getChatbotEndpoint, []);

  const isWidget = variant === "widget";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const history = messages
        .filter((message) => message.id !== "welcome")
        .slice(-10)
        .map((message) => ({ role: message.role, content: message.content }));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Unable to get a chatbot response right now.");
      }

      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: data.answer,
          sources: data.sources,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to get a chatbot response right now.";
      setError(message);
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content:
            "I could not reach the AI backend right now. Please check that VITE_API_BASE_URL points to the backend and the API key is configured there.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        isWidget ? "h-[32rem] max-h-[calc(100vh-8rem)]" : "min-h-[70vh]"
      )}
    >
      <div className="border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-mea-darkblue dark:text-white">
              MEA Assistant
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              AI-powered help for MEA, curriculum, ASC checks, and slot-clash guidance.
            </p>
          </div>
          <span className="rounded-full bg-mea-gold/20 px-2.5 py-1 text-[11px] font-medium text-mea-darkblue dark:text-mea-gold">
            Beta
          </span>
        </div>
      </div>

      <div className={cn("flex-1 space-y-4 overflow-y-auto p-4", isWidget ? "min-h-0" : "")}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-mea-lightblue text-white dark:bg-mea-darkblue"
                  : "border border-border bg-background text-foreground"
              )}
            >
              <p className="whitespace-pre-wrap">{renderMessage(message.content)}</p>
              {message.sources && message.sources.length > 0 ? (
                <div className="mt-3 border-t border-border/70 pt-2">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Useful verified sources
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {message.sources.slice(0, isWidget ? 3 : 6).map((source) =>
                      source.url ? (
                        <a
                          key={source.title}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground hover:text-mea-lightblue"
                        >
                          {source.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span
                          key={source.title}
                          className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground"
                        >
                          {source.title}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border bg-background p-3">
        {messages.length === 1 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-mea-lightblue hover:text-mea-lightblue"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        {error ? <p className="mb-2 text-xs text-destructive">{error}</p> : null}

        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about slots, curriculum, instructors, resources..."
            className="min-h-11 flex-1 resize-none rounded-lg text-sm"
            rows={isWidget ? 2 : 1}
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="h-11 shrink-0 bg-mea-lightblue px-4 text-white hover:bg-mea-darkblue"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Verify final registration, instructors, and live slot data on ASC or official department pages.
        </p>
      </div>
    </section>
  );
};

export default ChatWindow;
