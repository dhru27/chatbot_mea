import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChatWindow from "@/components/chatbot/ChatWindow";

const ChatbotInterface = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  if (location.pathname === "/chatbot") {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-[100] flex flex-col items-end gap-3",
        "bottom-6 right-6 max-[480px]:bottom-4 max-[480px]:right-4",
        "pb-[max(0px,env(safe-area-inset-bottom))]"
      )}
    >
      <div
        id="chatbot-widget-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="chatbot-widget-title"
        aria-hidden={!open}
        className={cn(
          "w-[min(calc(100vw-2rem),26rem)] origin-bottom-right transition-all duration-200",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0 invisible"
        )}
      >
        <div className="sr-only" id="chatbot-widget-title">
          MEA Assistant
        </div>
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-8 w-8 shrink-0"
            onClick={() => setOpen(false)}
            aria-label="Close chat panel"
          >
            <X className="h-4 w-4" />
          </Button>
          <ChatWindow variant="widget" />
        </div>
      </div>

      <Button
        type="button"
        size="icon"
        className="h-14 w-14 shrink-0 rounded-full bg-mea-lightblue text-white shadow-lg hover:bg-mea-darkblue"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chatbot-widget-panel"
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default ChatbotInterface;
