// Created: 2026-02-20
// Updated: 2026-03-30
// Version: v5.0
// Description: Team Entra Norway - Portal frontpage
// Purpose: Landing page for Team Entra Norway with team intro and quick-access cards
//          to Timeline Builder and Toolbox.
//          v5.0: Full rewrite — replaced timeline builder SPA with portal frontpage.

"use client";

import Link from "next/link";
import { Clock, Wrench, Shield, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-8 space-y-10">
      {/* Hero section */}
      <section className="max-w-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1
              className="text-3xl lg:text-4xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Team Entra Norway
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Internal portal for Identity &amp; Access Management
            </p>
          </div>
        </div>

        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Welcome to the Team Entra Norway portal. We are the Identity &amp;
          Access Management team responsible for Microsoft Entra ID, Azure
          security, and Microsoft 365 governance across the organisation. This
          site serves as our shared hub for tools, project timelines, and
          reference material.
        </p>
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          vitae enim in eros tristique tempus. Aliquam erat volutpat. Nulla
          facilisi. Proin non ante eget justo fringilla accumsan eu vel nunc.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Integer at lacus nec libero ullamcorper
          gravida.
        </p>
      </section>

      {/* Quick-access cards */}
      <section className="space-y-4">
        <h2
          className="text-lg font-semibold"
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

      {/* Footer */}
      <footer
        className="py-6 text-center text-sm"
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
