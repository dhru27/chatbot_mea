
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi there! I'm the MEA Assistant. How can I help you today?", isUser: false }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Add user message
    const userMessageId = messages.length + 1;
    setMessages([...messages, { id: userMessageId, text: newMessage, isUser: true }]);
    setNewMessage("");
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I'm here to help! What specific information about MEA are you looking for?",
        "You can find more details about that on our resources page.",
        "The next event is scheduled for next week. Check the events page for details!",
        "Feel free to email us at mea@iitb.ac.in for more information.",
        "That's a great question! Our team members would be happy to discuss this further."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prevMessages => [...prevMessages, { 
        id: prevMessages.length + 1, 
        text: randomResponse, 
        isUser: false 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-heading font-bold mb-6 text-mea-darkblue dark:text-white">MEA Assistant</h1>
        
        {/* Chat Messages */}
        <div className="h-[60vh] overflow-y-auto p-4 bg-gray-50/80 dark:bg-gray-800/30 rounded-lg border border-border mb-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-4 ${message.isUser ? 'text-right' : ''}`}
            >
              <div 
                className={`inline-block max-w-[85%] rounded-lg px-4 py-2 ${
                  message.isUser 
                    ? 'bg-mea-lightblue/90 text-white dark:bg-mea-darkblue' 
                    : 'bg-white dark:bg-gray-700 border border-gray-200/80 text-gray-800 dark:text-gray-100'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="flex items-center">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 mr-2 resize-none max-h-20 min-h-10 text-sm py-2 px-3 rounded-md border-mea-lightblue/20 dark:bg-gray-800 dark:border-gray-700"
            rows={1}
          />
          <Button 
            onClick={handleSendMessage}
            className="h-10 px-4 bg-mea-lightblue hover:bg-mea-darkblue"
          >
            <Send size={16} className="mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
