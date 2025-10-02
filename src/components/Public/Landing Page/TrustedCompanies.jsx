import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, useInView } from "framer-motion";

const TrustedCompanies = ({
  companies = [
   "Hager Group",
   "Wipro Limited",
   "Marico",
   "The Coca-Cola Company",      
  ],
  speedMs = 24000, // Lower is faster
  title = "Trusted by leading companies",
}) => {
  // Normalize input: allow strings or objects { name, logoUrl }
  const normalized = companies.map((it) =>
    typeof it === "string" ? { name: it, logoUrl: null } : it
  );
  const loop = [...normalized, ...normalized];

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const tlRef = useRef(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Control marquee with GSAP
  useEffect(() => {
    if (!trackRef.current || prefersReduced) return;
    // Duration in seconds; clamp to avoid too-fast/too-slow
    const duration = Math.max(8, Math.min(60, speedMs / 1000));
    tlRef.current = gsap.to(trackRef.current, {
      xPercent: -50, // move half the width because content is duplicated
      ease: "none",
      repeat: -1,
      duration,
    });
    return () => {
      tlRef.current && tlRef.current.kill();
    };
  }, [speedMs, prefersReduced]);

  // Pause when off-screen using Framer's useInView
  const inView = useInView(containerRef, { amount: 0.2 });
  useEffect(() => {
    if (!tlRef.current) return;
    if (inView) tlRef.current.resume();
    else tlRef.current.pause();
  }, [inView]);

  const handleEnter = () => tlRef.current && tlRef.current.pause();
  const handleLeave = () => tlRef.current && tlRef.current.resume();

  return (
    <motion.section
      ref={containerRef}
      className="w-full py-8"
      aria-label="Trusted companies"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Match TrustedHR's indigo badge style */}
        <div className="flex justify-center">
          <span className="inline-flex items-center rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
            Partners & Clients
          </span>
        </div>

        {/* Gradient heading to match TrustedHR */}
        <h3 className="mt-2 text-center text-[18px] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-500">
          {title}
        </h3>

        <div
          className="group relative mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <div
            ref={trackRef}
            className="tc-track flex w-max items-center gap-4 whitespace-nowrap will-change-transform"
            aria-hidden="true"
          >
            {loop.map(({ name, logoUrl }, idx) => (
              <motion.div
                key={`${name}-${idx}`}
                className="inline-flex items-center gap-2 justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[14px] font-medium text-slate-200 backdrop-blur-sm transition-colors hover:bg-white/10"
                title={name}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt=""
                    className="h-5 w-auto object-contain opacity-90"
                    loading="lazy"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="whitespace-nowrap">{name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TrustedCompanies;

