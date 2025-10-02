import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/common/PageTransition";
import ProtectedRoute from "./routes/ProtectedRoute";
import ApplicationForm from "./components/Public/other/ApplicationForm";

const HomePage = lazy(() => import("./pages/HomePage"));
const About = lazy(() => import("./pages/About"));
const TrustedHR = lazy(() => import("./components/Public/Landing Page/TrustedHR"));
const AttritionDemoService = lazy(() => import("./components/Client/Demo/AttritationControl"));
const EmployerSignupPage = lazy(() => import("./components/Public/other/EmployerSignupPage"));
const AttritationGrid = lazy(() => import("./components/Client/Demo/AttritationGrid"));
const ConfidentialData = lazy(() => import("./components/Client/Demo/ConfidentialData"));
const ContactUs = lazy(() => import("./components/Public/other/ContactUs"));
const EmployerLoginPage = lazy(() => import("./components/Public/other/EmployerLoginPage"));
const RecuitmentService = lazy(() => import("./components/Client/Recuitment/Recuitment"));

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen bg-gray-950 text-slate-200 flex items-center justify-center">Loading…</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/trusted-hr" element={<PageTransition><TrustedHR /></PageTransition>} />
          <Route path="/attrition-demo" element={<PageTransition><AttritionDemoService /></PageTransition>} />
          <Route path="/employer-signup" element={<PageTransition><EmployerSignupPage /></PageTransition>} />
          <Route path="/contact-us" element={<PageTransition><ContactUs /></PageTransition>} />
          <Route path="/employer-login" element={<PageTransition><EmployerLoginPage /></PageTransition>} />
          <Route path="/attrition-grid" element={<PageTransition><AttritationGrid /></PageTransition>} />
          <Route path="/recuitment-service" element={<PageTransition><RecuitmentService /></PageTransition>} />
          <Route path="/application-form" element={<PageTransition><ApplicationForm /></PageTransition>} />
          {/* Protected: corporate only */}
          <Route element={<ProtectedRoute requireCorporate corporateRedirectTo="/employer-login" />}> 
            
            <Route path="/confidential-data" element={<PageTransition><ConfidentialData /></PageTransition>} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
