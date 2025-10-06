import React, { useEffect, useMemo, useRef, useState } from "react";
import Footer from "../components/Public/Landing Page/Footer";
import Navbar from "../components/Public/Landing Page/Navbar";

// Simple scroll-reveal animation using IntersectionObserver
// Elements with class 'reveal' will fade+slide into view. Supports optional data-delay for staggering.
const useRevealOnScroll = () => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute("data-delay") || "0ms";
            entry.target.style.transitionDelay = delay;
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-6");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => {
      el.classList.add("opacity-0", "translate-y-6");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
};

// Count-up animation for numbers
const useCountUp = (end, duration = 1600) => {
  const [value, setValue] = useState(0);
  const startTs = useRef(null);

  useEffect(() => {
    let raf;
    const animate = (ts) => {
      if (!startTs.current) startTs.current = ts;
      const progress = Math.min((ts - startTs.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);

  return value;
};

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-slate-200 shadow-sm backdrop-blur hover:border-slate-600 transition">
    {children}
  </span>
);

const SectionTitle = ({ eyebrow, title, subtitle }) => (
  <div className="reveal transition-all duration-700">
    {eyebrow && (
      <p className="mb-3 inline-block rounded-full bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 px-3 py-1 text-xs font-medium tracking-wider text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
        {eyebrow}
      </p>
    )}
    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 max-w-3xl text-slate-300 leading-relaxed">{subtitle}</p>
    )}
  </div>
);

const IconCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const About = () => {
  useRevealOnScroll();
  // memoized count-up values for stats
  const stats = useMemo(() => (
    [
      { end: 500, suffix: "+", label: "Companies engaged across India" },
      { end: 100, suffix: "%", label: "Pan‑India coverage (metros + beyond)", display: "Pan‑India" },
      { end: 2, suffix: "→", label: "Frontline to senior mandates", display: "Volume → Leadership" },
      { end: 10, suffix: "Cr+", label: "Sales impact in documented programs" },
    ]
  ), []);

  const counts = stats.map((s) => useCountUp(s.end));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative">
      {/* Decorative animated background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/30 to-teal-400/20 blur-3xl animate-float-slow" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-emerald-400/20 to-sky-500/20 blur-3xl animate-float-slower" />
        <div className="absolute inset-0 opacity-[0.04] [background:radial-gradient(1px_1px_at_10px_10px,white_1px,transparent_0)] [background-size:24px_24px]" />
      </div>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-12 md:pt-28 md:pb-20">
          <div className="reveal transition-all duration-700" data-delay="0ms">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                IITG Jobs – Trusted HR Solutions Since 1995
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-relaxed">
              For over 30 years, IITG Jobs has stood at the forefront of human resources
              services—growing alongside India’s evolving workforce. Our legacy is built on
              consistency, reliability and adaptability. We’ve supported businesses through
              changing times, always delivering HR solutions that stand the test of time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="reveal transition-all duration-700" data-delay="100ms"><Badge>30+ years of expertise</Badge></div>
              <div className="reveal transition-all duration-700" data-delay="200ms"><Badge>Pan-India reach</Badge></div>
              <div className="reveal transition-all duration-700" data-delay="300ms"><Badge>Attrition Control – Guaranteed</Badge></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Organizations Trust Us */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionTitle
          eyebrow="Why Organizations Trust Us"
          title="Reliability, experience, and evolution — without losing the human touch"
          subtitle="We combine decades of domain knowledge with modern HR technology to deliver dependable, future‑ready outcomes."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="reveal transition-all duration-700 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm hover:border-slate-700 group relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(600px_200px_at_0%_0%,rgba(99,102,241,0.12),transparent)]" />
            <h3 className="text-lg font-semibold">Proven Experience</h3>
            <p className="mt-2 text-slate-300">
              With three decades of HR service expertise, we understand what works and what doesn’t.
              We’ve seen policy shifts, tech leaps, and evolving talent expectations — and adapted while
              keeping focus on what matters most.
            </p>
          </div>
          <div className="reveal transition-all duration-700 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm hover:border-slate-700 group relative overflow-hidden" data-delay="80ms">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(600px_200px_at_100%_0%,rgba(16,185,129,0.12),transparent)]" />
            <h3 className="text-lg font-semibold">Reliability & Consistency</h3>
            <p className="mt-2 text-slate-300">
              From recruiting top talent to navigating compliance, clients depend on us to deliver with
              integrity — year after year.
            </p>
          </div>
          <div className="reveal transition-all duration-700 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm hover:border-slate-700 group relative overflow-hidden" data-delay="160ms">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(600px_200px_at_0%_100%,rgba(14,165,233,0.12),transparent)]" />
            <h3 className="text-lg font-semibold">Evolving with HR Trends</h3>
            <p className="mt-2 text-slate-300">
              We embrace digital platforms, remote/hybrid models, data‑driven decisioning, and modern
              engagement practices — innovating on top of strong HR foundations.
            </p>
          </div>
          <div className="reveal transition-all duration-700 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm hover:border-slate-700 group relative overflow-hidden" data-delay="240ms">
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(600px_200px_at_100%_100%,rgba(236,72,153,0.10),transparent)]" />
            <h3 className="text-lg font-semibold">Trusted by Employers & Employees</h3>
            <p className="mt-2 text-slate-300">
              Employers choose us to reduce risk and improve retention. Candidates trust us for fairness,
              clarity, and respect.
            </p>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionTitle eyebrow="Core Services" title="Comprehensive HR offerings" />
        <div className="reveal transition-all duration-700 mt-8 flex flex-wrap gap-3">
          <Badge>Recruitment (CXO, Top Management, Executive, Volume, Lateral)</Badge>
          <Badge>Attrition Control Services</Badge>
          <Badge>Talent Acquisition Strategy</Badge>
          <Badge>Compliance & Payroll Support</Badge>
          <Badge>Employee Engagement</Badge>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionTitle
          eyebrow="Industry Expertise"
          title="Cross‑sector depth, nationwide execution"
          subtitle="From manufacturing and FMCG to IT/ITES, healthcare, logistics, automobile, pharma, retail, infrastructure, education, BFSI, and public sector — we understand the unique hiring cycles, skills, and compliance in each domain."
        />
        <div className="reveal transition-all duration-700 mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            "Manufacturing",
            "FMCG",
            "IT / IT‑ITES",
            "Healthcare",
            "Logistics",
            "Automobile / Auto Ancillaries",
            "Pharma / Biotech",
            "Retail",
            "Infrastructure / Construction",
            "Education",
            "Banking & Financial Services",
            "Government / NGOs",
          ].map((item) => (
            <div key={item} className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-slate-200 hover:border-slate-700">
              {item}
            </div>
          ))}
        </div>
        <p className="reveal transition-all duration-700 mt-6 text-sm text-slate-400">
          public.iitgindianjobs.com
        </p>
        <div className="reveal transition-all duration-700 mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h4 className="font-semibold">Tailored HR Solutions</h4>
            <p className="mt-2 text-slate-300">
              Experience across heavy industry to fast‑paced tech enables precise hiring and retention
              strategies customized to context.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h4 className="font-semibold">Regulatory & Local Know‑How</h4>
            <p className="mt-2 text-slate-300">
              Deep familiarity with employment laws and labour regulations across India, plus insights into
              global trends for scaling organizations.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h4 className="font-semibold">Keeping up with Global & Local Trends</h4>
            <p className="mt-2 text-slate-300">
              Remote/hybrid tooling, HRIS/HRMS integration, DEI, modern performance reviews, and upskilling
              aligned to global best practices.
            </p>
          </div>
        </div>
      </section>

      {/* Clientele & Track Record */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionTitle eyebrow="Clientele & Track Record — IITGJobs.com Pvt. Ltd." title="Trusted by leading brands" />
        <p className="reveal transition-all duration-700 mt-4 max-w-3xl text-slate-300">
          Over nearly three decades, we’ve partnered with top‑tier organizations — including Fortune 500s —
          to deliver executive search, strategic hiring, and special mandates.
        </p>
        <p className="reveal transition-all duration-700 mt-2 text-sm text-slate-400">public.iitgindianjobs.com</p>

        <div className="reveal transition-all duration-700 mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {[
            "Aditya Birla Group",
            "Hindustan Coca‑Cola Beverages",
            "ITC",
            "Airtel",
            "Vodafone",
            "Idea",
            "Marico",
            "Hager",
            "Other FMCG & Manufacturing",
          ].map((client) => (
            <div key={client} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 hover:border-slate-700">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">
                <IconCheck />
              </span>
              <span className="text-slate-200">{client}</span>
            </div>
          ))}
        </div>

        <div className="reveal transition-all duration-700 mt-8 grid gap-6 md:grid-cols-4">
          {/* Gradient border + count up */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-sky-500/30 to-emerald-500/40">
            <div className="rounded-2xl h-full w-full bg-slate-900/60 p-6">
              <p className="text-3xl font-extrabold">{counts[0]}+</p>
              <p className="mt-1 text-sm text-slate-400">{stats[0].label}</p>
            </div>
          </div>
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/40 via-indigo-500/30 to-sky-500/40">
            <div className="rounded-2xl h-full w-full bg-slate-900/60 p-6">
              <p className="text-3xl font-extrabold">Pan‑India</p>
              <p className="mt-1 text-sm text-slate-400">Metro and non‑metro coverage</p>
            </div>
          </div>
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-sky-500/40 via-emerald-500/30 to-indigo-500/40">
            <div className="rounded-2xl h-full w-full bg-slate-900/60 p-6">
              <p className="text-3xl font-extrabold">Volume → Leadership</p>
              <p className="mt-1 text-sm text-slate-400">Frontline to senior mandates</p>
            </div>
          </div>
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-pink-500/40 via-violet-500/30 to-emerald-500/40">
            <div className="rounded-2xl h-full w-full bg-slate-900/60 p-6">
              <p className="text-3xl font-extrabold">₹{counts[3]}Cr+</p>
              <p className="mt-1 text-sm text-slate-400">Documented outcomes in sales hiring programs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation & Recent Milestones */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionTitle eyebrow="Innovation & Recent Milestones" title="Data‑driven retention and research backbone" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="reveal transition-all duration-700 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold">Attrition Control Model</h3>
            <p className="mt-2 text-slate-300">
              Our proprietary model predicts, analyzes, and helps reduce employee turnover. It provides early
              warnings using data insights and competency frameworks, enabling preventive action.
            </p>
            <p className="mt-2 text-sm text-slate-400">public.iitgindianjobs.com</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-emerald-300">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 ring-1 ring-emerald-500/30">Predict</span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 ring-1 ring-emerald-500/30">Analyze</span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 ring-1 ring-emerald-500/30">Retain</span>
            </div>
          </div>
          <div className="reveal transition-all duration-700 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold">Specialised Data Support — Backbone</h3>
            <p className="mt-2 text-slate-300">
              Our in‑house R&D center leverages exclusive databases and tools to benchmark competency, salary,
              attrition norms, and market trends — enabling proactive, precise hiring.
            </p>
            <p className="mt-2 text-sm text-slate-400">public.iitgindianjobs.com</p>
          </div>
        </div>

        <div className="reveal transition-all duration-700 mt-6 rounded-2xl border border-emerald-700/40 bg-emerald-900/10 p-6 ring-1 ring-inset ring-emerald-600/20 backdrop-blur-sm">
          <p className="text-emerald-300 font-semibold">Guaranteed Attrition Control</p>
          <p className="mt-1 text-slate-300">
            We stand behind outcomes: “Attrition Control … Guaranteed!” — a strong commitment to finding and
            retaining talent.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionTitle eyebrow="Vision & Mission" title="Enabling organizations and individuals to thrive" />
        <div className="reveal transition-all duration-700 mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold">Vision</h3>
            <p className="mt-2 text-slate-300">
              “To become India’s most trusted talent partner — enabling organizations and individuals to
              thrive in the future of work.”
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold">Mission</h3>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li className="flex items-start gap-2"><IconCheck className="mt-0.5 text-indigo-300" />Empower organizations through people and retention‑focused teams.</li>
              <li className="flex items-start gap-2"><IconCheck className="mt-0.5 text-indigo-300" />Create future‑ready workforces using data insights and predictive models.</li>
              <li className="flex items-start gap-2"><IconCheck className="mt-0.5 text-indigo-300" />Bridge dreams & opportunities by connecting candidates with meaningful careers.</li>
              <li className="flex items-start gap-2"><IconCheck className="mt-0.5 text-indigo-300" />Innovate with integrity — transparency, ethics, and outcomes at the core.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Values & People‑First Approach */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <SectionTitle
          eyebrow="Values & People‑First Approach — IITGJobs.com Pvt. Ltd."
          title="HR is about people — hopes, growth, dignity, and trust"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Integrity & Transparency",
              text:
                "Clear, honest communication for clients and candidates. Structured, fair processes with predictable expectations across recruitment and evaluation.",
              className: "animate-float-slow hover:animate-float-slower",
            },
            {
              title: "Respect & Empathy",
              text:
                "We value individuals beyond resumes. We cultivate a supportive workplace where people feel heard, appreciated, and trusted.",
              className: "animate-float-slow hover:animate-float-slower",
            },
            {
              title: "Accountability & Ethics",
              text:
                "We take responsibility for promises — quality, timelines, and standards. We respect confidentiality and uphold professional ethics.",
            },
            {
              title: "Relationships Beyond Transactions",
              text:
                "We build long‑term partnerships, ensure follow‑ups, and track post‑hire success (retention, alignment) to continuously improve.",
            },
            {
              title: "Results with Quality & Care",
              text:
                "We deliver measurable outcomes without compromising dignity — leveraging competency frameworks, attrition models, and research.",
            },
          ].map(({ title, text, className }) => (
            <div
              key={title}
              className={`reveal transition-all duration-700 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 relative overflow-hidden group ${className || ""}`}
            >
              <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-700 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(99,102,241,0.08),rgba(16,185,129,0.08),rgba(56,189,248,0.08),rgba(99,102,241,0.08))]" />
              <h4 className="font-semibold">{title}</h4>
              <p className="mt-2 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

// Local component styles (animations)
// Note: These keyframes are scoped globally but lightweight and safe.
// Tailwind will pass through these class names via arbitrary animate-* utilities we call below.
// Here we embed minimal CSS to avoid tailwind.config edits.
const styles = `
@keyframes float-slow { 0% { transform: translateY(0) translateX(0) scale(1); } 50% { transform: translateY(-12px) translateX(8px) scale(1.02); } 100% { transform: translateY(0) translateX(0) scale(1); } }
@keyframes float-slower { 0% { transform: translateY(0) translateX(0) scale(1); } 50% { transform: translateY(10px) translateX(-8px) scale(1.03); } 100% { transform: translateY(0) translateX(0) scale(1); } }
.animate-float-slow { animation: float-slow 10s ease-in-out infinite; will-change: transform; }
.animate-float-slower { animation: float-slower 14s ease-in-out infinite; will-change: transform; }
`;

// Inject styles once per mount
if (typeof document !== "undefined" && !document.getElementById("about-local-styles")) {
  const el = document.createElement("style");
  el.id = "about-local-styles";
  el.innerHTML = styles;
  document.head.appendChild(el);
}
