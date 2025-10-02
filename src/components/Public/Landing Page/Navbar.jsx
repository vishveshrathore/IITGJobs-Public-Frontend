import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// ✅ Menu Config
const navConfig = [
  { label: "Home", target: "home" },
  { label: "About Us", href: "/about" },
  {
    label: "Our Services",
    dropdown: [
      { label: "Attrition Control", href: "/attrition-demo" },
      { label: "Recruitment Service", href: "/recuitment-service" },
      
    ],
  },
  { label: "Our Team", href: "/our-team" },
  {
    label: "Jobs",
    dropdown: [
      { label: "Post Resume", href: "/application-form" },
      // { label: "Candidate Login", href: "/jobs/login" },
    ],
  },
  {
    label: "Employer",
    dropdown: [
      // { label: "Employer Login", href: "/employer-login" },
      { label: "Employer Signup", href: "/employer-signup" },
    ],
  },
];

// ✅ Utility
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ✅ Dropdown (Desktop)
const Dropdown = ({ label, items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-200 hover:text-white"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      >
        {label}
        <svg
          className={classNames(
            "h-4 w-4 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0"
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={classNames(
          "absolute left-0 mt-2 w-60 origin-top-left rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-xl ring-1 ring-white/10 transition-all z-50",
          open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"
        )}
      >
        <div className="absolute -top-2 left-6 h-4 w-4 rotate-45 border border-white/10 bg-slate-900" />
        {items.map((it) => (
          <NavLink
            key={it.label}
            to={it.href}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              classNames(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5",
                isActive ? "text-indigo-400" : "text-slate-200"
              )
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500/80 group-hover:scale-125 transition-transform" />
            {it.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

// ✅ Accordion (Mobile)
const MobileAccordion = ({ label, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
        <svg
          className={classNames("h-4 w-4 transition-transform", open && "rotate-180")}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="space-y-1 pb-3">
          {items.map((it) => (
            <NavLink
              key={it.label}
              to={it.href}
              className={({ isActive }) =>
                classNames(
                  "block px-8 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-300"
                )
              }
            >
              {it.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Main Navbar
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  // Smooth scroll
  const scrollToId = (id) => {
    if (!id) return;
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section highlighting
  useEffect(() => {
    const ids = ["home", "about", "services"];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) => entry.isIntersecting && setActiveSection(entry.target.id)
        ),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.map((id) => document.getElementById(id)).filter(Boolean).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={classNames(
        "sticky top-0 z-50 w-full backdrop-blur-xl border-b",
        scrolled
          ? "bg-gradient-to-b from-black/80 via-slate-950/70 to-slate-900/60 border-white/10 shadow"
          : "bg-gradient-to-b from-black/60 via-slate-950/50 to-slate-900/40 border-white/5"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* ✅ Brand */}
        <button onClick={() => scrollToId("home")} className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 shadow-sm dark:bg-slate-900">
            <svg viewBox="0 0 40 40" className="h-6 w-6" fill="none">
              <circle cx="20" cy="20" r="15.5" stroke="#2563eb" />
              <path d="M15 11v18" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
              <path d="M25 11v11c0 4.2-3.4 7.6-7.6 7.6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-semibold text-white">
              IITGJobs.com Pvt. Ltd.
            </span>
            <span className="text-[12px] font-medium text-slate-300">Jobs • Talent • Growth</span>
          </div>
        </button>

        {/* ✅ Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2">
          {navConfig.map((item) =>
            item.dropdown ? (
              <Dropdown key={item.label} label={item.label} items={item.dropdown} />
            ) : item.href ? (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    "px-4 py-2.5 text-base font-medium",
                    isActive
                      ? "text-indigo-500 dark:text-indigo-400"
                      : "text-slate-200 hover:text-white"
                  )
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <button
                key={item.label}
                onClick={() => scrollToId(item.target)}
                className={classNames(
                  "relative px-4 py-2.5 text-base font-medium",
                  activeSection === item.target
                    ? "text-indigo-500 dark:text-indigo-400"
                    : "text-slate-200 hover:text-white"
                )}
              >
                {item.label}
              </button>
            )
          )}
        </div>

        {/* ✅ Mobile Toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 text-slate-200"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* ✅ Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-gradient-to-b from-black/80 via-slate-950/70 to-slate-900/60">
          {navConfig.map((item) =>
            item.dropdown ? (
              <MobileAccordion key={item.label} label={item.label} items={item.dropdown} />
            ) : item.href ? (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-5 py-3 text-base text-slate-200 hover:text-white"
              >
                {item.label}
              </NavLink>
            ) : (
              <button
                key={item.label}
                onClick={() => {
                  scrollToId(item.target);
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-5 py-3 text-base text-slate-200 hover:text-white"
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
