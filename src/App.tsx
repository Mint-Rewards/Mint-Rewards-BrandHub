import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BrandRegister from "./pages/BrandRegister";
import BrandLogin from "./pages/BrandLogin";
import AdminLogin from "./pages/AdminLogin";
import BrandDashboard from "./pages/BrandDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import { BrandProtectedRoute } from "./components/BrandProtectedRoute";
import NotFound from "./pages/NotFound";
import DemoPage from "./pages/DemoPage";
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
          <Route path="/register" element={<BrandRegister />} />
          <Route path="/brand/login" element={<BrandLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard/add-collection/"
            element={
              <AdminProtectedRoute>
                <AddCollection />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard/transit-collections/"
            element={
              <AdminProtectedRoute>
                <TransitCollections />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard/finalized-collections/"
            element={
              <AdminProtectedRoute>
                <FinalizedCollections />
              </AdminProtectedRoute>
            }
          />
          <Route path="/demo" element={<DemoPage />} />
          <Route
            path="/dashboard/:brandId"
            element={
              <BrandProtectedRoute>
                <BrandDashboard />
              </BrandProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
