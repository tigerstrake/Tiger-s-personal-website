import Link from "next/link";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

const SOCIAL = [
  { label: "GitHub", href: "https://github.com/tigerstrake", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tiger-strake-8581582a1/", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/tiger.strake/", icon: Instagram },
  { label: "Email", href: "mailto:tiger29@stanford.edu", icon: Mail },
];

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/build-log", label: "Build Log" },
  { href: "/flight", label: "Flight" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link {
          font-size: 0.875rem;
          color: #5A5F6E;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #8A8F9C; }
        .footer-social {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 0.875rem;
          color: #5A5F6E;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-social:hover { color: #C8865A; }
      `}</style>

      <footer
        className="relative z-10 mt-auto border-t"
        style={{
          borderColor: "rgba(255,255,255,0.07)",
          background: "rgba(7,8,12,0.95)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Identity */}
            <div>
              <span
                className="text-sm font-semibold tracking-wide block mb-3"
                style={{ fontFamily: "var(--font-display)", color: "#ECEDF2", letterSpacing: "0.04em" }}
              >
                TIGER STRAKE
              </span>
              <p className="text-sm leading-relaxed" style={{ color: "#4D5260" }}>
                Stanford AeroAstro. Building rockets, UAVs, and embedded systems.
              </p>
            </div>

            {/* Nav links */}
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-4"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Pages
              </span>
              <ul className="space-y-2 list-none m-0 p-0">
                {FOOTER_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-widest block mb-4"
                style={{ color: "#4D5260", fontFamily: "var(--font-display)" }}
              >
                Contact
              </span>
              <ul className="space-y-2 list-none m-0 p-0">
                {SOCIAL.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="footer-social"
                    >
                      <Icon size={14} />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <p className="text-xs" style={{ color: "#4D5260" }}>
              © {new Date().getFullYear()} Tiger Strake
            </p>
            <p className="text-xs" style={{ color: "#4D5260" }}>
              Stanford University · AeroAstro
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
