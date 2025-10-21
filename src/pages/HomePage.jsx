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
      <TrustedCompanies />

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

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Why Choose IITG Jobs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold">30+ Years of Experience</h3>
            <p className="mt-2 text-slate-300">Proven hiring solutions and faster time‑to‑hire across India.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold">Attrition Control Services</h3>
            <p className="mt-2 text-slate-300">Data‑led retention frameworks that reduce churn and stabilize teams.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold">Pan‑India Delivery</h3>
            <p className="mt-2 text-slate-300">Jabalpur‑based team serving metros and tier‑2/3 locations.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold">Compliance Confidence</h3>
            <p className="mt-2 text-slate-300">Payroll, onboarding, documentation, and statutory support.</p>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Our Core Services</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold">Recruitment Solutions</h3>
            <p className="mt-2 text-slate-300">Leadership, lateral, campus, and volume hiring with structured assessments.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold">Attrition Control</h3>
            <p className="mt-2 text-slate-300">Predictive models, risk flags, and engagement playbooks to retain talent.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold">Talent Strategy</h3>
            <p className="mt-2 text-slate-300">Workforce planning, competency mapping, and employer branding.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <h3 className="font-semibold">Payroll & Compliance</h3>
            <p className="mt-2 text-slate-300">Accurate payroll, documentation, and statutory compliance in India.</p>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Industries We Serve</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            "Manufacturing",
            "FMCG",
            "IT / IT‑ITES",
            "Healthcare",
            "Logistics",
            "Infrastructure",
            "BFSI",
            "Retail",
            "Automobile",
          ].map((item) => (
            <div key={item} className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-slate-200 hover:border-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to Hire? Let’s Talk</h2>
        <p className="mt-3 max-w-2xl text-slate-300">Get a tailored plan from a trusted recruitment agency in India. Reduce attrition and accelerate growth with IITG Jobs.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/contact-us" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">Hire Now</a>
          <a href="/about" className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700">Why Choose Us</a>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default HomePage;