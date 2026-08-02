import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/metadata";

export const runtime = "edge";
export const alt = `${siteConfig.name} - AI Prompt Engineering Studio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f5f1e8 0%, #e7efe6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: 20,
            backgroundColor: "#4f7a5a",
            marginBottom: 32,
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        {/* Title */}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#222222",
            textAlign: "center",
            margin: 0,
            letterSpacing: -1,
          }}
        >
          AI Context Studio
        </h1>
        {/* Description */}
        <p
          style={{
            fontSize: 28,
            color: "#6b6b6b",
            textAlign: "center",
            marginTop: 16,
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Build, customize, and export AI instruction assets
        </p>
        {/* Tagline badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 32,
          }}
        >
          {["System Prompts", "MCP Configs", "Personas", "Workflows"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 20px",
                borderRadius: 999,
                backgroundColor: "#e7efe6",
                color: "#4f7a5a",
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
