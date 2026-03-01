import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";

// Patient Pages
import AppointmentsPage from "./pages/patient/AppointmentsPage";
import PrescriptionsPage from "./pages/patient/PrescriptionsPage";
import DoctorsPage from "./pages/patient/DoctorsPage";
import PharmacyPage from "./pages/patient/PharmacyPage";
import MedicinesPage from "./pages/patient/MedicinesPage";
import HealthRecordsPage from "./pages/patient/HealthRecordsPage";
import SymptomCheckerPage from "./pages/patient/SymptomCheckerPage";

// Doctor Pages
import PatientsPage from "./pages/doctor/PatientsPage";
import PrescriptionsManagePage from "./pages/doctor/PrescriptionsManagePage";
import DoctorAppointmentsPage from "./pages/doctor/AppointmentsPage";
import ConsultationsPage from "./pages/doctor/ConsultationsPage";
import SchedulePage from "./pages/doctor/SchedulePage";

// Pharmacy Pages
import InventoryPage from "./pages/pharmacy/InventoryPage";
import OrdersPage from "./pages/pharmacy/OrdersPage";
import PharmacyPrescriptionsPage from "./pages/pharmacy/PrescriptionsPage";
import SalesPage from "./pages/pharmacy/SalesPage";
import PharmacySettingsPage from "./pages/pharmacy/SettingsPage";

// Admin Pages
import UsersManagePage from "./pages/admin/UsersManagePage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Patient Routes */}
            <Route path="/patient/appointments" element={<AppointmentsPage />} />
            <Route path="/patient/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/patient/doctors" element={<DoctorsPage />} />
            <Route path="/patient/pharmacy" element={<PharmacyPage />} />
            <Route path="/patient/medicines" element={<MedicinesPage />} />
            <Route path="/patient/health-records" element={<HealthRecordsPage />} />
            <Route path="/patient/symptom-checker" element={<SymptomCheckerPage />} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/doctor/patients" element={<PatientsPage />} />
            <Route path="/doctor/prescriptions" element={<PrescriptionsManagePage />} />
            <Route path="/doctor/consultations" element={<ConsultationsPage />} />
            <Route path="/doctor/schedule" element={<SchedulePage />} />
            
            {/* Pharmacy Routes */}
            <Route path="/pharmacy/inventory" element={<InventoryPage />} />
            <Route path="/pharmacy/orders" element={<OrdersPage />} />
            <Route path="/pharmacy/prescriptions" element={<PharmacyPrescriptionsPage />} />
            <Route path="/pharmacy/sales" element={<SalesPage />} />
            <Route path="/pharmacy/settings" element={<PharmacySettingsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/users" element={<UsersManagePage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
