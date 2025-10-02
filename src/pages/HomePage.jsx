import Navbar from "../components/Public/Landing Page/Navbar";
import HeroBanner from "../components/Public/Landing Page/HeroBanner";
import TrustedHR from "../components/Public/Landing Page/TrustedHR";
import Footer from "../components/Public/Landing Page/Footer";

const HomePage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-100">
      <Navbar />
      <HeroBanner />
      <TrustedHR />
      <Footer />

    </div>
  );
};

export default HomePage;