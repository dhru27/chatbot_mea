
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotInterface from "@/components/ChatbotInterface";
import { Toaster } from "@/components/ui/toaster";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatbotInterface />
      <Toaster />
    </div>
  );
};

export default MainLayout;
