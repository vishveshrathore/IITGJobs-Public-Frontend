import React from "react";
import Navbar from "../../../components/Public/Landing Page/Navbar";
import Footer from "../../../components/Public/Landing Page/Footer";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, duration: 0.5, ease: "easeOut" },
  }),
};

const AttritionDemoService = () => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate("/employer-signup"); 
  };

  const handleContactClick = () => {
    navigate("/attrition-grid"); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-100">
      <Navbar />
      <motion.section
        className="relative py-16"
        initial="hidden"
        animate="visible"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-800" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <motion.div variants={fadeUp}>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Attrition Control
              </h1>
              <p className="mt-3 mx-auto max-w-3xl text-base text-slate-300">
                Proactive insights and retention strategies powered by people
                analytics.
              </p>

              {/* 🔥 Added new description about Churn Control Model */}
              <p className="mt-4 mx-auto max-w-3xl text-base text-slate-300">
                Our <strong>Attrition Control</strong> is a ground-breaking
                solution designed to reduce employee attrition by up to{" "}
                <strong>80%</strong>. Using advanced AI, our tool generates{" "}
                <strong>HR Alert Reports</strong> – a list of employees who are
                actively involved in reemployment activity and are most likely
                to leave in the near future.
              </p>
            </motion.div>

            {/* --- Updated Buttons Group --- */}
            <motion.div
              variants={fadeUp}
              custom={1}
              className="mt-6 flex flex-wrap justify-center gap-3"
            >
              {/* Primary Button: Request a Demo */}
              <button
                onClick={handleDemoClick}
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-500 transition hover:translate-y-[-1px] hover:shadow-xl hover:scale-[1.02] hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                Request a Demo
              </button>

              {/* Secondary Outline Button: Contact Sales */}
              <button
                onClick={handleContactClick}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 hover:shadow-lg hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Demo
              </button>
            </motion.div>
            {/* ------------------------------------------- */}
          </div>

          <motion.div
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-sm ring-1 ring-transparent transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-300/20"
            variants={fadeUp}
            custom={2}
          >
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-indigo-400/10 text-indigo-300 ring-1 ring-indigo-400/20">
              {/* Icon related to graphs/monitoring for 'Attrition Control' */}
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="M18 17l-3-3-4 4-5-5" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">
              Key Features
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-300">
              <li>
                <strong>Attrition Control:</strong> Reduces employee attrition
                by up to 80% with predictive AI analysis.
              </li>
              <li>
                <strong>HR Alert Reports:</strong> Identifies employees engaged
                in reemployment activity and flags probable attrition risks.
              </li>
              <li>
                <strong>HR Retention Team Collaboration:</strong> Dedicated
                support to collaborate with your HR team on implementing
                effective retention strategies.
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.section>
      <Footer />
    </div>
  );
};

export default AttritionDemoService;