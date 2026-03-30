// Created: 2026-02-20
// Updated: 2026-06-24
// Version: v7.0
// Description: Team Entra Norway - Portal frontpage with parallax floating shapes
// Purpose: Landing page with full-viewport hero, floating geometric shapes that drift
//          at different scroll speeds, stats highlight bar, quick-access cards,
//          and scroll-triggered fade-in animations.
//          v5.0: Full rewrite — replaced timeline builder SPA with portal frontpage.
//          v6.0: Added parallax shapes, expanded hero, stats bar, scroll animations.
//          v7.0: Replaced Shield icon with custom team logo (teamentralogoNOBG.png).

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Wrench,
  Users,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Fingerprint,
  Cloud,
} from "lucide-react";

/* ── Parallax shape definitions ───────────────────────────── */
interface Shape {
  top: string;
  left: string;
  size: number;
  borderRadius: string;
  speed: number;
  opacity: number;
  delay: string;
  ring?: boolean; // ring = border only, no fill
}

const SHAPES: Shape[] = [
  { top: "5%",  left: "8%",  size: 140, borderRadius: "50%",  speed: 0.12, opacity: 0.07, delay: "0s" },
  { top: "15%", left: "75%", size: 90,  borderRadius: "30%",  speed: 0.25, opacity: 0.09, delay: "1s", ring: true },
  { top: "35%", left: "85%", size: 180, borderRadius: "50%",  speed: 0.08, opacity: 0.05, delay: "2s" },
  { top: "50%", left: "5%",  size: 60,  borderRadius: "50%",  speed: 0.35, opacity: 0.12, delay: "0.5s", ring: true },
  { top: "60%", left: "55%", size: 110, borderRadius: "25%",  speed: 0.18, opacity: 0.06, delay: "3s" },
  { top: "75%", left: "20%", size: 200, borderRadius: "50%",  speed: 0.06, opacity: 0.04, delay: "1.5s" },
  { top: "85%", left: "70%", size: 70,  borderRadius: "50%",  speed: 0.3,  opacity: 0.1,  delay: "2.5s", ring: true },
];

/* ── Stats data ───────────────────────────────────────────── */
const STATS = [
  { icon: <Wrench className="w-5 h-5" />,        label: "14+ Tools",             sub: "Curated toolbox" },
  { icon: <Fingerprint className="w-5 h-5" />,    label: "Identity Governance",   sub: "Entra ID & PIM" },
  { icon: <ShieldCheck className="w-5 h-5" />,    label: "Zero Trust",            sub: "Security posture" },
  { icon: <Cloud className="w-5 h-5" />,          label: "Microsoft Cloud",       sub: "Azure & M365" },
];

/* ── useInView hook (IntersectionObserver) ────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/* ── Page component ───────────────────────────────────────── */
export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef(0);
  const mainRef = useRef<HTMLElement>(null);

  const statsRef = useInView();
  const cardsRef = useInView();
  const footerRef = useInView(0.3);

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (mainRef.current) setScrollY(mainRef.current.scrollTop);
    });
  }, []);

  return (
    <main
      ref={mainRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto relative"
      style={{ background: "var(--background)" }}
    >
      {/* ── Floating parallax shapes ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {SHAPES.map((s, i) => (
          <div
            key={i}
            className="parallax-shape"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              borderRadius: s.borderRadius,
              opacity: s.opacity,
              animationDelay: s.delay,
              animationDuration: `${6 + i * 0.8}s`,
              transform: `translateY(${scrollY * -s.speed}px)`,
              ...(s.ring
                ? { border: "2px solid var(--accent)", background: "transparent" }
                : { background: "var(--accent)" }),
            }}
          />
        ))}
      </div>

      {/* ── Hero section (full viewport) ── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 lg:px-8 py-16">
        <div className="mb-6">
          <Image
            src="/teamentralogoNOBG.png"
            alt="Team Entra Norway logo"
            width={80}
            height={80}
            unoptimized
            priority
          />
        </div>

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Team Entra Norway
        </h1>

        <p
          className="mt-3 text-lg sm:text-xl font-medium"
          style={{ color: "var(--accent)" }}
        >
          Identity &amp; Access Management
        </p>

        <p
          className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          We are the Identity &amp; Access Management team responsible for
          Microsoft Entra ID, Azure security, and Microsoft 365 governance
          across the organisation. This portal is our shared hub for tools,
          project timelines, and reference material.
        </p>

        {/* Scroll indicator */}
        <div className="scroll-indicator mt-12" style={{ color: "var(--text-muted)" }}>
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ── Stats highlight bar ── */}
      <section
        ref={statsRef as React.RefObject<HTMLElement>}
        className="fade-section relative px-6 lg:px-8 py-8"
      >
        <div
          className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl p-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "var(--accent-subtle)",
                  color: "var(--accent)",
                }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {stat.label}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {stat.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick-access cards ── */}
      <section
        ref={cardsRef as React.RefObject<HTMLElement>}
        className="fade-section relative px-6 lg:px-8 py-8"
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Timeline card */}
          <Link
            href="/timeline"
            className="group rounded-xl p-6 transition-all flex flex-col gap-3"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--accent-subtle)",
                color: "var(--accent)",
              }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <h3
              className="text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Timeline Builder
            </h3>
            <p
              className="text-sm flex-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Create and share interactive project timelines with milestones,
              custom icons, and multiple visualization styles.
            </p>
            <span
              className="inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Open <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Toolbox card */}
          <Link
            href="/toolbox"
            className="group rounded-xl p-6 transition-all flex flex-col gap-3"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--accent-subtle)",
                color: "var(--accent)",
              }}
            >
              <Wrench className="w-5 h-5" />
            </div>
            <h3
              className="text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Toolbox
            </h3>
            <p
              className="text-sm flex-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Browse our curated collection of security and administration tools
              for Entra ID, Azure, and Microsoft 365.
            </p>
            <span
              className="inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              Open <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Team card (info only) */}
          <div
            className="rounded-xl p-6 flex flex-col gap-3"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--accent-subtle)",
                color: "var(--accent)",
              }}
            >
              <Users className="w-5 h-5" />
            </div>
            <h3
              className="text-base font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              The Team
            </h3>
            <p
              className="text-sm flex-1"
              style={{ color: "var(--text-secondary)" }}
            >
              We manage identity governance, conditional access, privileged
              access management, and security posture across the Microsoft cloud
              estate.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        ref={footerRef as React.RefObject<HTMLElement>}
        className="fade-section relative py-6 mx-6 lg:mx-8 text-center text-sm"
        style={{
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border)",
        }}
      >
        Team Entra Norway &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
