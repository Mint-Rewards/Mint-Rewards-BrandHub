import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BrandRegister from "./pages/BrandRegister";
import AdminLogin from "./pages/AdminLogin";
import BrandDashboard from "./pages/BrandDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import AddCollection from "./pages/AddCollection";
import TransitCollections from "./pages/TransitCollections";
import FinalizedCollections from "./pages/FinalizedCollections";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/register" element={<BrandRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/dashboard/add-collection/"
            element={<AddCollection />}
          />
          <Route
            path="/admin/dashboard/transit-collections/"
            element={<TransitCollections />}
          />
          <Route
            path="/admin/dashboard/finalized-collections/"
            element={<FinalizedCollections />}
          />
          <Route path="/dashboard/:brandId" element={<BrandDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL '*' ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
