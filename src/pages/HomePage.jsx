import Navbar from "../components/Public/Landing Page/Navbar";
import HeroBanner from "../components/Public/Landing Page/HeroBanner";
import TrustedHR from "../components/Public/Landing Page/TrustedHR";
import Footer from "../components/Public/Landing Page/Footer";
import TrustedCompanies from "../components/Public/Landing Page/TrustedCompanies";
import { useAuth } from "../context/authcontext.jsx";

const HomePage = () => {
  const { isAuthenticated, isCorporate, user, logout } = useAuth();

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <HeroBanner />
      <TrustedHR />
      <TrustedCompanies />
      <Footer />

    </div>
  );
};

export default HomePage;