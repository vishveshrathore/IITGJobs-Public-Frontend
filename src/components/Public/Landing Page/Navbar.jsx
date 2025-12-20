import React, { useState, useRef, useEffect, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authcontext.jsx";

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
      { label: "Job Openings", href: "/job-openings" },
    ],
  },
  {
    label: "Employer",
    dropdown: [
      { label: "Employer Login", href: "/employer-login" },
      { label: "Employer Signup", href: "/employer-signup" },
      { label: "My Jobs", href: "/recruitment/my-jobs" },
      { label: "Search Profile", href: "/search-profiles" },
      { label: "Post Job", href: "/post-job" },
      
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
  if (!items?.length) return null;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-brand-300"
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
          "absolute left-0 mt-2 w-60 origin-top-left rounded-xl border border-border bg-surface-95 p-2 shadow-xl transition-all z-50",
          open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"
        )}
      >
        <div className="absolute -top-2 left-6 h-4 w-4 rotate-45 border border-border bg-surface" />
        {items.map((it) => (
          <NavLink
            key={it.label}
            to={it.href}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              classNames(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/5",
                isActive ? "text-brand-300" : "text-foreground"
              )
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600 group-hover:scale-125 transition-transform" />
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
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground"
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
                  "block px-8 py-2 text-sm hover:bg-white/5",
                  isActive ? "text-brand-300" : "text-foreground"
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
  const { isAuthenticated, isCorporate, user, logout } = useAuth();

  const computedNavItems = useMemo(() => {
    if (!(isAuthenticated && isCorporate)) return navConfig;
    return navConfig.map((item) => {
      if (item.label !== "Employer") return item;
      const filtered = item.dropdown?.filter(
        (entry) => entry.label !== "Employer Login" && entry.label !== "Employer Signup"
      );
      return { ...item, dropdown: filtered };
    });
  }, [isAuthenticated, isCorporate]);

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
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.map((id) => document.getElementById(id)).filter(Boolean).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navShellClass = scrolled
    ? "border-white/15 bg-[rgba(5,8,20,0.9)] shadow-[0_20px_60px_rgba(2,6,23,0.55)]"
    : "border-white/10 bg-[rgba(5,8,20,0.75)] shadow-[0_14px_40px_rgba(2,6,23,0.45)]";

  return (
    <header className="sticky top-0 z-50 px-3 py-3 backdrop-blur-sm bg-gradient-to-b from-black/40 via-black/10 to-transparent">
      <nav
        className={classNames(
          "mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-5 py-3 transition-all duration-300 backdrop-blur-xl",
          navShellClass
        )}
      >
        {/* ✅ Brand */}
        <button onClick={() => scrollToId("home")} className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface ring-1 shadow-sm">
            <svg viewBox="0 0 40 40" className="h-6 w-6" fill="none">
              <circle cx="20" cy="20" r="15.5" stroke="var(--color-brand-600)" />
              <path d="M15 11v18" stroke="var(--color-brand-600)" strokeWidth="2" strokeLinecap="round" />
              <path d="M25 11v11c0 4.2-3.4 7.6-7.6 7.6" stroke="var(--color-brand-600)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-semibold text-foreground">IITGJobs.com Pvt. Ltd.</span>
            <span className="text-[12px] font-medium text-muted">Jobs • Talent • Growth</span>
          </div>
        </button>

        {/* ✅ Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2">
          {computedNavItems.map((item) =>
            item.dropdown ? (
              <Dropdown key={item.label} label={item.label} items={item.dropdown} />
            ) : item.href ? (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    "px-4 py-2.5 text-base font-medium",
                    isActive ? "text-brand-300" : "text-foreground hover:text-brand-300"
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
                  activeSection === item.target ? "text-brand-300" : "text-foreground hover:text-brand-300"
                )}
              >
                {item.label}
              </button>
            )
          )}
        </div>

        {/* ✅ Account (Desktop) */}
        {isAuthenticated && isCorporate ? (
          <div className="hidden lg:flex items-center">
            <AccountDropdown
              name={user?.hrName || user?.name || "Employer"}
              details={{
                name: user?.hrName || user?.name || "-",
                companyName: user?.companyName || "-",
                email: user?.email || "-",
                mobile: user?.mobile || "-",
                designation: user?.designation || "-",
              }}
              onMyJobs={() => navigate('/recruitment/my-jobs')}
              onLogout={() => { logout(); navigate('/'); }}
            />
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <NavLink to="/employer-login" className="px-4 py-2.5 text-base font-medium text-foreground hover:text-brand-300">Employer Login</NavLink>
          </div>
        )}

        {/* ✅ Mobile Toggle */}
        <button onClick={() => setMobileOpen((v) => !v)} className="lg:hidden p-2 text-foreground">
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* ✅ Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.35))' }}>
          {navConfig.map((item) =>
            item.dropdown ? (
              <MobileAccordion key={item.label} label={item.label} items={item.dropdown} />
            ) : item.href ? (
              <NavLink key={item.label} to={item.href} onClick={() => setMobileOpen(false)} className="block px-5 py-3 text-base text-foreground hover:text-brand-300">
                {item.label}
              </NavLink>
            ) : (
              <button
                key={item.label}
                onClick={() => { scrollToId(item.target); setMobileOpen(false); }}
                className="block w-full text-left px-5 py-3 text-base text-foreground hover:text-brand-300"
              >
                {item.label}
              </button>
            )
          )}

          {isAuthenticated && isCorporate && (
            <div className="border-t border-border mt-1">
              <div className="px-5 pt-3 pb-1 text-sm text-foreground/80">{user?.hrName || user?.name || 'Employer'}</div>
              <div className="px-5 pb-2 text-xs text-foreground/70 space-y-1">
                <div><span className="text-foreground/50">Company:</span> {user?.companyName || '-'}</div>
                <div><span className="text-foreground/50">Designation:</span> {user?.designation || '-'}</div>
                <div><span className="text-foreground/50">Email:</span> {user?.email || '-'}</div>
                <div><span className="text-foreground/50">Mobile:</span> {user?.mobile || '-'}</div>
              </div>
              <button className="block w-full text-left px-5 py-3 text-base text-foreground hover:text-brand-300" onClick={() => { navigate('/recruitment/my-jobs'); setMobileOpen(false); }}>My Jobs</button>
              <button className="block w-full text-left px-5 py-3 text-base text-red-400 hover:text-red-300" onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}>Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

// Local Account Dropdown
const AccountDropdown = ({ name, details, onMyJobs, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative ml-2" ref={ref}>
      <button
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:text-brand-300"
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="whitespace-nowrap">{name}</span>
        <svg
          className={classNames("h-4 w-4 transition-transform duration-200", open ? "rotate-180" : "rotate-0")}
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
          "absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-border bg-surface-95 p-2 shadow-xl transition-all z-50",
          open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"
        )}
        role="menu"
      >
        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border border-border bg-surface" />
        <div className="px-3 py-2 text-sm text-foreground/90">
          <div className="font-medium">{details?.name || name}</div>
          <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-foreground/75">
            <div><span className="text-foreground/50">Company:</span> {details?.companyName || '-'}</div>
            <div><span className="text-foreground/50">Designation:</span> {details?.designation || '-'}</div>
            <div><span className="text-foreground/50">Email:</span> {details?.email || '-'}</div>
            <div><span className="text-foreground/50">Mobile:</span> {details?.mobile || '-'}</div>
          </div>
        </div>
        <button
          className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground hover:bg-white/5"
          onClick={() => { setOpen(false); onMyJobs?.(); }}
          role="menuitem"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-600 group-hover:scale-125 transition-transform" />
          My Jobs
        </button>
        <button
          className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-white/5 hover:text-red-300"
          onClick={() => { setOpen(false); onLogout?.(); }}
          role="menuitem"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 group-hover:scale-125 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
};
