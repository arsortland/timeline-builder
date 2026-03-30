// Created: 2026-03-30
// Version: v1.1 - Added expandable full article view with heading support
// Description: Learn (blog) page for Team Entra Norway portal
// Purpose: Displays blog posts in a single-column card layout. Each card shows
//          an image, title, date, read time, and description excerpt.
//          Clicking "Read more" expands the card to show the full article.
//          Paragraphs starting with ## are rendered as section headings.
//          Paragraphs starting with ### are rendered as sub-headings.

"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, Calendar, Clock, ArrowLeft } from "lucide-react";
import { posts } from "../lib/learnData";

export default function LearnPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const expandedPost = expandedId
    ? posts.find((p) => p.id === expandedId)
    : null;

  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-2">
          {expandedPost ? (
            <button
              onClick={() => setExpandedId(null)}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: "var(--accent-subtle)",
                color: "var(--accent)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--accent-subtle)")
              }
              title="Back to all posts"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--accent-subtle)",
                color: "var(--accent)",
              }}
            >
              <BookOpen className="w-5 h-5" />
            </div>
          )}
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {expandedPost ? expandedPost.title : "Learn"}
          </h1>
        </div>
        {!expandedPost && (
          <p
            className="mb-8 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Articles, guides, and notes from the team.
          </p>
        )}

        {/* Full article view */}
        {expandedPost ? (
          <article className="mt-6">
            {/* Meta */}
            <div
              className="flex items-center gap-4 mb-6 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {expandedPost.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {expandedPost.readTime}
              </span>
            </div>

            {/* Image banner */}
            <div
              className="w-full h-64 rounded-xl mb-8 overflow-hidden relative"
              style={{ background: "var(--accent-subtle)" }}
            >
              <Image
                src={expandedPost.image}
                alt={expandedPost.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Article content */}
            <div className="space-y-4">
              {expandedPost.content.map((paragraph, i) => {
                if (paragraph.startsWith("### ")) {
                  return (
                    <h4
                      key={i}
                      className="text-base font-semibold mt-6"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {paragraph.slice(4)}
                    </h4>
                  );
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h3
                      key={i}
                      className="text-lg font-bold mt-8 mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {paragraph.slice(3)}
                    </h3>
                  );
                }
                return (
                  <p
                    key={i}
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Back button at bottom */}
            <button
              onClick={() => setExpandedId(null)}
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "var(--accent)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all posts
            </button>
          </article>
        ) : (
          /* Card listing */
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl overflow-hidden transition-all cursor-pointer"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
                onClick={() => setExpandedId(post.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Image */}
                <div
                  className="w-full h-48 overflow-hidden relative"
                  style={{ background: "var(--accent-subtle)" }}
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.title}
                  </h2>

                  <div
                    className="flex items-center gap-4 mb-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {post.description}
                  </p>

                  <span
                    className="inline-block mt-4 text-sm font-medium"
                    style={{ color: "var(--accent)" }}
                  >
                    Read more &rarr;
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
