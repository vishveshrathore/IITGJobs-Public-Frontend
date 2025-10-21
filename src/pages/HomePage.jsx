import Navbar from "../components/Public/Landing Page/Navbar";
import HeroBanner from "../components/Public/Landing Page/HeroBanner";
import TrustedHR from "../components/Public/Landing Page/TrustedHR";
import Footer from "../components/Public/Landing Page/Footer";
import TrustedCompanies from "../components/Public/Landing Page/TrustedCompanies";

const HomePage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-100">
      <Navbar />
      <HeroBanner />
      <TrustedHR />

      {/* SEO Content: Recruitment Agency India */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Recruitment Agency India — IITG Jobs, Jabalpur, Madhya Pradesh
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300 leading-relaxed">
          IITGJobs.com Pvt. Ltd. is India’s trusted recruitment partner from Jabalpur, Madhya Pradesh. We deliver
          end‑to‑end hiring solutions, <strong className="text-slate-100">Attrition Control Services</strong>, talent strategy, and
          compliance support to help organizations scale with confidence.
        </p>
      </section>

      <TrustedCompanies />


      <Footer />

    </div>
  );
};

export default HomePage;