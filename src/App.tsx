import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/layouts/MainLayout";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import Index from "@/pages/Index";
import Gallery from "@/pages/Gallery";
import Events from "@/pages/Events";
import RegisterPage from "@/pages/RegisterPage";
import Resources from "@/pages/Resources";
import Editorial from "@/pages/Editorial";
import Team from "@/pages/Team";
import Docs from "@/pages/Docs";
import DAMP from "@/pages/DAMP";
import Chatbot from "@/pages/Chatbot";
import FormsListPage from "@/pages/FormsListPage";
import FormPage from "@/pages/FormPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:eventId/register" element={<RegisterPage />} />
              <Route path="resources" element={<Resources />} />
              <Route path="editorial" element={<Editorial />} />
              <Route path="team" element={<Team />} />
              <Route path="docs" element={<Docs />} />
              <Route path="damp" element={<DAMP />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="forms" element={<FormsListPage />} />
              <Route path="forms/:formId" element={<FormPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <PWAInstallPrompt />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
