import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion, useInView } from "framer-motion";

const TrustedCompanies = ({
  companies = [
   "Hager Group",
   "Wipro Limited",
   "Marico",
   "the coca-cola company",
   "itc",      
   "vodafone-idea",
   "Sun Flag",
   "tech mahindra",
   "IGT",
  ],
  speedMs = 24000, // Lower is faster
  title = "Trusted by leading companies",
  showNameWithLogo = false, // kept for compat; names are hidden visually when logos exist
  logoHeight = 56, // px height for marquee logos
  grayscaleLogos = false, // show original logos by default
  logoMap = {}, // optional override/extension map: { [lowercased name]: url }
}) => {
  // Built-in defaults: put your files under public/logos/*
  const defaultLogoMap = {
    "the coca-cola company": "/logos/coca-cola.png",
    "itc": "/logos/itc.png",
    "airtel": "/logos/airtel.png",
    "vodafone-idea": "/logos/VI.png",
    "marico": "/logos/marico.jpg",
    "hager": "/logos/hager.png",
    "hager group": "/logos/hager.png",
    "Wipro Limited": "/logos/wipro.png",
    "Sun Flag": "/logos/Sunflag.png",
    "tech mahindra": "/logos/techmahindra.png",
    "IGT": "/logos/igt.png",
  };

  const mergedLogoMap = { ...defaultLogoMap, ...(logoMap || {}) };

  const keyLower = (name) => (name || "").toString().trim().toLowerCase();

  const lookupLogo = (name) => {
    if (!name) return null;
    // Try exact key first (preserves your casing like "Wipro Limited")
    if (mergedLogoMap[name]) return mergedLogoMap[name];
    // Then try lowercase key
    const lower = keyLower(name);
    if (mergedLogoMap[lower]) return mergedLogoMap[lower];
    // Attempt common normalization for hyphen/space variants
    const alt = lower.replace(/-/g, " ");
    return mergedLogoMap[alt] || null;
  };

  // Normalize input: allow strings or objects { name, logoUrl }
  const normalized = companies.map((it) => {
    if (typeof it === "string") {
      return { name: it, logoUrl: lookupLogo(it) };
    }
    const name = it?.name;
    return { ...it, logoUrl: it?.logoUrl ?? lookupLogo(name) };
  });
  // Only logos per request (skip entries without a logo)
  const logosOnly = normalized.filter((n) => !!n.logoUrl);
  const loop = [...logosOnly, ...logosOnly];

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

        {/* Heading */}
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
                className="inline-flex items-center justify-center px-2"
                title={name}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={name}
                    className={`${grayscaleLogos ? "grayscale hover:grayscale-0" : ""} drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]`}
                    style={{ height: logoHeight, width: "auto", objectFit: "contain", imageRendering: "auto" }}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to hide broken image and show name
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                {/* Keep accessible name for screen readers */}
                {logoUrl && <span className="sr-only">{name}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default TrustedCompanies;

