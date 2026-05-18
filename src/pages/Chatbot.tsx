
import ChatWindow from "@/components/chatbot/ChatWindow";

const Chatbot = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-heading font-bold text-mea-darkblue dark:text-white">
          MEA Assistant
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Ask academic and MEA questions using the verified knowledge base. For live registration data,
          always verify on ASC.
        </p>
        <ChatWindow variant="page" />
      </div>
    </div>
  );
};

export default Chatbot;
