import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/common/PageTransition";
import ProtectedRoute from "./routes/ProtectedRoute";
import ApplicationForm from "./components/Public/other/ApplicationForm";
import OurTeam from "./components/Public/other/OurTeam";
import SEO from "./components/common/SEO";
import { PRIMARY_DOMAIN } from "./seo.config";

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

  const seo = useMemo(() => {
    const path = location.pathname || "/";
    const baseUrl = PRIMARY_DOMAIN;
    const common = {
      image: `${baseUrl}/logo.png`,
      url: `${baseUrl}${path}`,
      canonical: `${baseUrl}${path}`,
      robots: "index,follow",
    };
    const map = {
      "/": {
        title: "IITG Indian Jobs | Latest Job Openings & Career Opportunities",
        description:
          "Find the latest job openings in India at IITG Indian Jobs. Explore government jobs, private sector opportunities, internships, and career resources.",
        jsonLd: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "IITG Indian Jobs",
              alternateName: "IITG Jobs",
              url: `${baseUrl}/`,
              logo: `${baseUrl}/logo.png`,
              sameAs: [
                // Add your social URLs if available
              ]
            },
            {
              "@type": "WebSite",
              name: "IITG Jobs",
              url: `${baseUrl}/`,
              potentialAction: {
                "@type": "SearchAction",
                target: `${baseUrl}/?q={search_term_string}`,
                queryInput: "required name=search_term_string"
              }
            }
          ]
        },
      },
      "/about": {
        title: "About IITG Jobs | Trusted HR & Recruitment in India",
        description:
          "Learn about IITG Jobs' 30+ years of HR expertise across industries with nationwide reach and guaranteed attrition control.",
      },
      "/trusted-hr": {
        title: "Trusted HR Services | IITG Jobs",
        description:
          "Reliable HR solutions including recruitment, talent strategy, and retention programs tailored for Indian enterprises.",
        robots: "noindex,follow",
      },
      "/attrition-demo": {
        title: "Attrition Control Demo | IITG Jobs",
        description:
          "Preview IITG Jobs' proprietary attrition control model with data-driven retention insights.",
      },
      "/employer-signup": {
        title: "Employer Signup | IITG Jobs",
        description:
          "Create your employer account to access recruitment and HR solutions tailored to your organization.",
        robots: "noindex,follow",
      },
      "/employer-login": {
        title: "Employer Login | IITG Jobs",
        description:
          "Login to manage your recruitment, postings, and HR services with IITG Jobs.",
        robots: "noindex,follow",
      },
      "/contact-us": {
        title: "Contact IITG Jobs | Get In Touch",
        description:
          "Reach out to IITG Jobs for recruitment, HR services, and partnership inquiries across India.",
      },
      "/attrition-grid": {
        title: "Attrition Grid | IITG Jobs",
        description:
          "Explore attrition metrics and controls as part of IITG Jobs' retention solutions.",
        robots: "noindex,follow",
      },
      "/recuitment-service": {
        title: "Recruitment Services | IITG Jobs",
        description:
          "End-to-end recruitment from frontline to leadership with nationwide execution and domain expertise.",
        robots: "index,follow",
      },
      "/application-form": {
        title: "Job Application | IITG Jobs",
        description:
          "Apply for open roles via IITG Jobs' application form. Secure and streamlined.",
        robots: "noindex,follow",
      },
      "/our-team": {
        title: "Our Team | IITG Jobs",
        description:
          "Meet the IITG Jobs leadership and experts behind our HR and recruitment services.",
        robots: "noindex,follow",
      },
      "/confidential-data": {
        title: "Confidential Data | IITG Jobs",
        description:
          "Protected corporate area for data insights and dashboards.",
        robots: "noindex,nofollow",
      },
    };
    const current = map[path] || map["/"];
    return { ...common, ...current, robots: current.robots || common.robots };
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="min-h-screen bg-gray-950 text-slate-200 flex items-center justify-center">Loading…</div>}>
        <SEO
          title={seo.title}
          description={seo.description}
          image={seo.image}
          url={seo.url}
          canonical={seo.canonical}
          robots={seo.robots}
          jsonLd={seo.jsonLd}
          siteName={"IITG Jobs"}
        />
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
          <Route path="/our-team" element={<PageTransition><OurTeam /></PageTransition>} />
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
