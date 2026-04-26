"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/build-log", label: "Build Log" },
  { href: "/flight", label: "Flight" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          padding: 6px 12px;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 6px;
          color: #8A8F9C;
          font-family: var(--font-display);
          transition: color 0.2s;
          text-decoration: none;
        }
        .nav-link:hover { color: #ECEDF2; }
        .nav-link.active { color: #C8865A; }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 12px;
          right: 12px;
          height: 1px;
          border-radius: 999px;
          background: #C8865A;
        }
        .nav-cv {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid rgba(200,134,90,0.3);
          background: rgba(200,134,90,0.05);
          color: #C8865A;
          font-family: var(--font-display);
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s;
        }
        .nav-cv:hover {
          background: rgba(200,134,90,0.12);
          border-color: rgba(200,134,90,0.5);
        }
        .mobile-link {
          display: block;
          padding: 16px 0;
          font-size: 1.5rem;
          font-weight: 600;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          color: #ECEDF2;
        }
        .mobile-link.active { color: #C8865A; }
      `}</style>

      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? "rgba(7, 8, 12, 0.88)" : "rgba(7, 8, 12, 0.0)",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
          transition: "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
        }}
      >
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--font-display)",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#ECEDF2",
              textDecoration: "none",
            }}
          >
            <Image
              src="/images/tiger-logo.png"
              alt="Tiger logo"
              width={48}
              height={48}
              style={{ borderRadius: "8px" }}
            />
            TIGER STRAKE
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link href={href} className={`nav-link${active ? " active" : ""}`}>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <a href="/docs/tiger-strake-cv.pdf" download className="nav-cv hidden md:inline-flex">
            CV
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded"
            style={{
              color: "#8A8F9C",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(7, 8, 12, 0.97)" }}
        >
          <div className="flex flex-col pt-20 px-6">
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`mobile-link${active ? " active" : ""}`}
                >
                  {label}
                </Link>
              );
            })}
            <a
              href="/docs/tiger-strake-cv.pdf"
              download
              className="mt-6 py-3 text-center text-sm font-semibold rounded border"
              style={{
                fontFamily: "var(--font-display)",
                color: "#C8865A",
                borderColor: "rgba(200, 134, 90, 0.3)",
                textDecoration: "none",
              }}
            >
              Download CV
            </a>
          </div>
        </div>
      )}
    </>
  );
}
