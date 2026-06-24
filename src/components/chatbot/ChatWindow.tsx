import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, BookOpen, GraduationCap, Loader2, MessageCircle, Phone, RefreshCw, Send, Shuffle, Tag, TicketPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface ChatWindowProps {
  variant?: "page" | "widget";
}

interface CategoryDef {
  key: string;
  label: string;
  icon: React.ReactNode;
  subOptions: Record<string, string>;
}

const CATEGORIES: CategoryDef[] = [
  {
    key: "honors",
    label: "Honors",
    icon: <GraduationCap className="h-5 w-5" />,
    subOptions: {
      "retagging in honors": "Retagging in Honors",
    },
  },
  {
    key: "nptel",
    label: "NPTEL",
    icon: <RefreshCw className="h-5 w-5" />,
    subOptions: {
      "asc pr abhi tk nptel reflect nhi hua": "NPTEL not reflected on ASC yet",
      "nptel came to asc but wrong tag": "NPTEL on ASC but wrong tag",
      "two nptel courses showing as a single course": "Two NPTEL courses merged into one",
      "nptel not being counted towards credits": "NPTEL not being counted towards credits",
      "nptel process": "How does the NPTEL process work?",
    },
  },
  {
    key: "dic_courses",
    label: "DIC Courses",
    icon: <BookOpen className="h-5 w-5" />,
    subOptions: {
      "course not reflected": "Course not reflected on portal",
      "need to convert ce102 to me104 equivalent": "Convert CE102 to ME104 equivalent",
    },
  },
  {
    key: "retagging_issues",
    label: "Retagging Issues",
    icon: <Tag className="h-5 w-5" />,
    subOptions: {
      "error course is not part of course bulletin or undefined": "Course not in bulletin / undefined error",
      "robotic minor not able to see its tag on asc": "Robotics minor tag not visible on ASC",
    },
  },
];

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getApiBase = () => {
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");
  return base || "";
};

const renderMessage = (content: string) => {
  const lines = content.split("\n");
  return lines.map((line, index) => (
    <span key={`${line.slice(0, 20)}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
};

const ChatWindow = ({ variant = "page" }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showEscalation, setShowEscalation] = useState(false);
  const [ldapId, setLdapId] = useState("");
  const [escalationMsg, setEscalationMsg] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiBase = useMemo(getApiBase, []);
  const isWidget = variant === "widget";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, showEscalation]);

  useEffect(() => {
    fetch(`${apiBase}/chatbot/meta`)
      .then((r) => r.json())
      .then((d) => setLastUpdated(d.last_updated))
      .catch(() => {});
  }, [apiBase]);

  const addAssistantMsg = (content: string) => {
    setMessages((prev) => [...prev, { id: makeId(), role: "assistant", content }]);
  };

  const addUserMsg = (content: string) => {
    setMessages((prev) => [...prev, { id: makeId(), role: "user", content }]);
  };

  const handleCategoryClick = (cat: CategoryDef) => {
    setActiveCategory(cat.key);
    setShowEscalation(false);
    setTicketSuccess(false);
    addUserMsg(cat.label);

    const listing = Object.values(cat.subOptions).join("\n• ");
    addAssistantMsg(
      `Here are the common queries for ${cat.label}. Please pick one below, or feel free to type your own question:\n\n• ${listing}`
    );
  };

  const handleSubOptionClick = (ruleKey: string, label: string) => {
    const cat = CATEGORIES.find((c) => c.key === activeCategory);
    if (!cat) return;
    const answer = cat.subOptions[ruleKey];
    if (!answer) return;

    addUserMsg(label);
    sendToBackend(ruleKey, activeCategory);
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
    setShowEscalation(false);
    setTicketSuccess(false);
    addAssistantMsg("No problem! Please choose a category below, or type your question directly.");
  };

  const sendToBackend = async (text: string, category: string | null) => {
    setError(null);
    setIsLoading(true);
    setShowEscalation(false);
    setTicketSuccess(false);

    try {
      const response = await fetch(`${apiBase}/chatbot/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, category }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "Unable to get a response right now.");

      addAssistantMsg(data.response);

      if (data.escalate) {
        setShowEscalation(true);
        setEscalationMsg(text);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to reach the backend.";
      setError(message);
      addAssistantMsg("Sorry, I couldn't process your request right now. Please try again or pick a category above.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendFreeformMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading) return;

    addUserMsg(trimmed);
    setInput("");
    await sendToBackend(trimmed, activeCategory);
  };

  const handleTicketSubmit = async () => {
    if (!ldapId.trim()) return;
    setTicketSubmitting(true);
    try {
      const response = await fetch(`${apiBase}/chatbot/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: escalationMsg,
          ldap_id: ldapId.trim(),
          category: activeCategory || "any_other_issue",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "Failed to create ticket.");

      setShowEscalation(false);
      setTicketSuccess(true);
      setLdapId("");
      addAssistantMsg(
        `Your query has been forwarded successfully (Ticket ID: ${data.ticket?.id?.slice(0, 8)}…). ` +
        `Keshav (DGSec) and Komal Mam will review it and respond within 24 hours. ` +
        `You can also reach Keshav directly at (+91) 78765 61677.`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create ticket.";
      setError(message);
    } finally {
      setTicketSubmitting(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendFreeformMessage();
    }
  };

  const activeCategoryDef = CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        isWidget ? "h-[32rem] max-h-[calc(100vh-8rem)]" : "min-h-[70vh]"
      )}
    >
      {/* Header */}
      <div className="border-b border-border bg-muted/40 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-mea-darkblue dark:text-white">
              MEA Assistant
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Quick answers for academic queries, ASC issues, and course-related help.
            </p>
          </div>
          <span className="rounded-full bg-mea-gold/20 px-2.5 py-1 text-[11px] font-medium text-mea-darkblue dark:text-mea-gold">
            Beta
          </span>
        </div>
      </div>

      {/* Chat body */}
      <div className={cn("flex-1 space-y-4 overflow-y-auto p-4", isWidget ? "min-h-0" : "")}>
        {/* Welcome + category buttons */}
        {messages.length === 0 && !activeCategory ? (
          <div className="space-y-4">
            <div className="flex justify-start">
              <div className="max-w-[88%] rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground">
                <p>Hi! I'm the MEA Assistant. I can help you with academic queries, NPTEL processes, retagging issues, and more. Choose a category below or type your question directly.</p>
              </div>
            </div>
            <div className={cn("grid gap-2", isWidget ? "grid-cols-1" : "grid-cols-2")}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm font-medium text-foreground transition-all hover:border-mea-lightblue hover:bg-mea-lightblue/5 hover:text-mea-lightblue"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mea-lightblue/10 text-mea-lightblue">
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Messages */}
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
            </div>
          </div>
        ))}

        {/* Sub-option buttons */}
        {activeCategoryDef && !isLoading && !showEscalation && !ticketSuccess ? (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeCategoryDef.subOptions).map(([ruleKey, label]) => (
                <button
                  key={ruleKey}
                  type="button"
                  onClick={() => handleSubOptionClick(ruleKey, label)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-mea-lightblue hover:text-mea-lightblue"
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleBackToCategories}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-mea-lightblue"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to categories
            </button>
          </div>
        ) : null}

        {/* Category buttons after messages */}
        {messages.length > 0 && !activeCategory && !isLoading && !showEscalation ? (
          <div className="space-y-2">
            <div className={cn("grid gap-2", isWidget ? "grid-cols-1" : "grid-cols-2")}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm font-medium text-foreground transition-all hover:border-mea-lightblue hover:bg-mea-lightblue/5 hover:text-mea-lightblue"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mea-lightblue/10 text-mea-lightblue">
                    {cat.icon}
                  </span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Escalation UI */}
        {showEscalation ? (
          <div className="rounded-xl border-2 border-amber-400/60 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-950/30">
            <div className="mb-3 flex items-center gap-2">
              <TicketPlus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Forward to Keshav (DGSec) & Komal Mam
              </h3>
            </div>
            <p className="mb-3 text-xs text-amber-700 dark:text-amber-400">
              Enter your LDAP ID to forward your query. You'll typically get a response within 24 hours.
              You can also reach Keshav directly at (+91) 78765 61677.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={ldapId}
                onChange={(e) => setLdapId(e.target.value)}
                placeholder="e.g. 25b0001"
                className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-mea-lightblue focus:outline-none dark:border-amber-600 dark:bg-amber-950/50"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleTicketSubmit}
                  disabled={!ldapId.trim() || ticketSubmitting}
                  className="flex-1 bg-amber-600 text-white hover:bg-amber-700"
                >
                  {ticketSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                  Forward Query
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEscalation(false)}
                  className="border-amber-300 dark:border-amber-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Looking up your query...
            </div>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-background p-3">
        {error ? <p className="mb-2 text-xs text-destructive">{error}</p> : null}

        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeCategory
                ? "Type a question about this topic, or pick an option above..."
                : "Type any academic question..."
            }
            className="min-h-11 flex-1 resize-none rounded-lg text-sm"
            rows={isWidget ? 2 : 1}
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={() => sendFreeformMessage()}
            disabled={!input.trim() || isLoading}
            className="h-11 shrink-0 bg-mea-lightblue px-4 text-white hover:bg-mea-darkblue"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            Verify final registration, instructors, and live slot data on ASC or official department pages.
          </p>
          {lastUpdated ? (
            <p className="shrink-0 text-[10px] font-medium text-muted-foreground/70">
              Data last updated: {lastUpdated}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ChatWindow;
