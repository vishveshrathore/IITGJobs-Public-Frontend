import React from "react";
import Footer from "../components/Public/Landing Page/Footer";
import Navbar from "../components/Public/Landing Page/Navbar";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-extrabold tracking-tight">About Us</h1>
        <p className="mt-5 text-slate-300 leading-relaxed">
        We are into recruitment industry for more than 30
years specializing our services across domain and
industries in India.

With our team of 250+ seasoned recruiters, we
cater our services to fortune 500 companies.
        </p>
        <br />
        <p>We follow a structured approach for the
recruitment process –

Research, Analysis of Market trends, Benchmark
and a detailed competency evaluation frameworks.

We offer a real time solution which is highly cost
effective and time saving.</p>  
      </main>
      <Footer />
    </div>
  );
};

export default About;
