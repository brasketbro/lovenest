import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

// Pages
import Home from "@/pages/Home";
import Gallery from "@/pages/Gallery";
import Countdown from "@/pages/Countdown";
import Messages from "@/pages/Messages";
import BucketList from "@/pages/BucketList";
import NotFound from "@/pages/not-found";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChibiStickers from "@/components/ChibiStickers";

function Router() {
  const [location] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Handle initial navigation from URL hash if present
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const validRoutes = ["gallery", "countdown", "messages", "bucket-list"];
      
      if (validRoutes.includes(hash) && location === "/") {
        window.history.pushState(null, "", `/${hash}`);
        window.location.reload();
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/countdown" component={Countdown} />
          <Route path="/messages" component={Messages} />
          <Route path="/bucket-list" component={BucketList} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <ChibiStickers />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
