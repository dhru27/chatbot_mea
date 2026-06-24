import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Clock,
  Eye,
  Loader2,
  Lock,
  MessageSquare,
  Send,
  TicketCheck,
  Timer,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TicketMessage {
  sender: string;
  message: string;
  is_internal_note: boolean;
  created_at: string;
}

interface Ticket {
  id: string;
  ldap_id: string;
  category: string;
  status: string;
  messages: TicketMessage[];
}

const CATEGORY_LABELS: Record<string, string> = {
  honors_minors_majors: "Honors / Minors / Majors",
  dic_courses: "DIC Courses",
  retagging_issues: "Retagging Issues",
  global_updates: "FAQ / Global Updates",
  any_other_issue: "Other",
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  open: { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-700 dark:text-green-400", label: "Open" },
  investigating: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-400", label: "Investigating" },
  resolved: { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-400", label: "Resolved" },
};

const getApiBase = () => {
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");
  return base || "";
};

const SENDER_NAME: Record<string, string> = {
  student: "Student",
  keshav: "Keshav",
  komal_mam: "Komal Mam",
};

const AdminDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [senderName, setSenderName] = useState("keshav");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiBase = getApiBase();

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/chatbot/admin/tickets`);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data: Ticket[] = await res.json();
      setTickets(data);
    } catch {
      /* silently retry on next poll */
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, [fetchTickets]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, tickets]);

  const selectedTicket = tickets.find((t) => t.id === selectedId);

  const handleSendReply = async (messageOverride?: string) => {
    const msg = messageOverride || replyText.trim();
    if (!msg || !selectedId || sending) return;

    setSending(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        sender: senderName,
        message: msg,
        is_internal_note: String(isInternalNote),
      });
      const res = await fetch(
        `${apiBase}/chatbot/admin/tickets/${selectedId}/reply?${params.toString()}`,
        { method: "POST" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to send reply");
      }
      setReplyText("");
      setIsInternalNote(false);
      await fetchTickets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleQuickReply = () => {
    handleSendReply("We require some time to find the solution");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-heading font-bold text-mea-darkblue dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage student tickets and respond to escalated queries.
        </p>
      </div>

      <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* ── Left panel: Ticket list ── */}
        <div className="flex w-80 shrink-0 flex-col border-r border-border bg-muted/30">
          <div className="border-b border-border bg-muted/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <TicketCheck className="h-5 w-5 text-mea-lightblue" />
              <h2 className="text-sm font-semibold">Tickets</h2>
              <span className="ml-auto rounded-full bg-mea-lightblue/20 px-2 py-0.5 text-[11px] font-medium text-mea-lightblue">
                {tickets.length}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No tickets yet.
              </div>
            ) : (
              tickets.map((ticket) => {
                const lastMsg = ticket.messages[ticket.messages.length - 1];
                const statusStyle = STATUS_STYLES[ticket.status] || STATUS_STYLES.open;
                const isSelected = selectedId === ticket.id;
                return (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => setSelectedId(ticket.id)}
                    className={cn(
                      "flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition-colors",
                      isSelected
                        ? "bg-mea-lightblue/10 dark:bg-mea-lightblue/20"
                        : "hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">
                        {ticket.ldap_id}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          statusStyle.bg,
                          statusStyle.text
                        )}
                      >
                        {statusStyle.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {CATEGORY_LABELS[ticket.category] || ticket.category}
                    </span>
                    {lastMsg ? (
                      <p className="truncate text-xs text-muted-foreground">
                        {lastMsg.sender === "student" ? "Student" : "You"}: {lastMsg.message}
                      </p>
                    ) : null}
                    <span className="text-[10px] text-muted-foreground/60">
                      {lastMsg?.created_at}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right panel: Message history + reply ── */}
        <div className="flex flex-1 flex-col">
          {!selectedTicket ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
              <MessageSquare className="h-12 w-12 opacity-30" />
              <p className="text-sm">Select a ticket to view the conversation</p>
            </div>
          ) : (
            <>
              {/* Ticket header */}
              <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mea-lightblue/20 text-mea-lightblue">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {selectedTicket.ldap_id}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        (STATUS_STYLES[selectedTicket.status] || STATUS_STYLES.open).bg,
                        (STATUS_STYLES[selectedTicket.status] || STATUS_STYLES.open).text
                      )}
                    >
                      {(STATUS_STYLES[selectedTicket.status] || STATUS_STYLES.open).label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {CATEGORY_LABELS[selectedTicket.category] || selectedTicket.category} · Ticket {selectedTicket.id.slice(0, 8)}…
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMC41IiBmaWxsPSIjZTJlOGYwIiBmaWxsLW9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==')] p-5">
                {selectedTicket.messages.map((msg, idx) => {
                  const isStudent = msg.sender === "student";
                  const isInternal = msg.is_internal_note;

                  return (
                    <div
                      key={`${msg.created_at}-${idx}`}
                      className={cn("flex", isStudent ? "justify-start" : "justify-end")}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                          isInternal
                            ? "border-2 border-dashed border-purple-300 bg-purple-50 text-purple-900 dark:border-purple-600 dark:bg-purple-950/40 dark:text-purple-200"
                            : isStudent
                              ? "rounded-tl-sm bg-white text-foreground dark:bg-gray-800"
                              : "rounded-tr-sm bg-mea-lightblue text-white dark:bg-mea-darkblue"
                        )}
                      >
                        <div className="mb-1 flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold opacity-80">
                            {SENDER_NAME[msg.sender] || msg.sender}
                          </span>
                          {isInternal ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-purple-600 dark:text-purple-400">
                              <Lock className="h-3 w-3" />
                              Internal
                            </span>
                          ) : null}
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        <div className={cn("mt-1 flex items-center justify-end gap-1 text-[10px] opacity-60")}>
                          <Clock className="h-3 w-3" />
                          {msg.created_at}
                          {!isStudent && !isInternal ? <Check className="h-3 w-3" /> : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply composer */}
              <div className="border-t border-border bg-background p-3">
                {error ? <p className="mb-2 text-xs text-destructive">{error}</p> : null}

                {/* Controls row: sender, internal note toggle, quick reply */}
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-medium text-muted-foreground">Reply as:</label>
                    <select
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs focus:border-mea-lightblue focus:outline-none"
                    >
                      <option value="keshav">Keshav</option>
                      <option value="komal_mam">Komal Mam</option>
                    </select>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-purple-600 focus:ring-purple-500"
                    />
                    <span className="flex items-center gap-1 text-xs text-purple-700 dark:text-purple-400">
                      <Eye className="h-3.5 w-3.5" />
                      Internal Note (For Komal Mam only)
                    </span>
                  </label>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleQuickReply}
                    disabled={sending}
                    className="ml-auto gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-950/30"
                  >
                    <Timer className="h-3.5 w-3.5" />
                    Need More Time
                  </Button>
                </div>

                {/* Text input + send */}
                <div className="flex items-end gap-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder={
                      isInternalNote
                        ? "Write an internal note (only visible to admins)..."
                        : "Type a reply to the student..."
                    }
                    className={cn(
                      "min-h-11 flex-1 resize-none rounded-lg text-sm",
                      isInternalNote && "border-purple-300 bg-purple-50/50 dark:border-purple-600 dark:bg-purple-950/20"
                    )}
                    rows={2}
                    disabled={sending}
                  />
                  <Button
                    type="button"
                    onClick={() => handleSendReply()}
                    disabled={!replyText.trim() || sending}
                    className={cn(
                      "h-11 shrink-0 px-4 text-white",
                      isInternalNote
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-mea-lightblue hover:bg-mea-darkblue"
                    )}
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
