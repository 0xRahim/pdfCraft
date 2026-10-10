import React from "react";
import { Link } from "../../lib/router";
import { useAuth } from "../../lib/authContext";
import { Navbar } from "../../components/landing/Navbar";
import { Hero } from "../../components/landing/Hero";
import { PipelineDemo } from "../../components/landing/PipelineDemo";
import { Features } from "../../components/landing/Features";
import { ApiSection } from "../../components/landing/ApiSection";
import { SelfHost } from "../../components/landing/SelfHost";
import { Footer } from "../../components/landing/Footer";
import { Reveal } from "../../components/landing/Reveal";
import { GITHUB_URL } from "../../components/landing/GitHubIcon";
import { isVercelHost } from "../../lib/host";

const ClosingCta: React.FC = () => {
  const auth = useAuth();
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20 md:pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-14 md:p-16 text-center shadow-[0_24px_64px_rgba(83,74,183,0.35)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(480px 260px at 15% 10%, rgba(255,255,255,0.16), transparent 70%), radial-gradient(520px 300px at 85% 90%, rgba(255,255,255,0.12), transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="font-heading font-semibold tracking-tight text-white text-[28px] leading-[34px] md:text-[40px] md:leading-[46px]">
                Stop hand-crafting PDFs.
                <br />
                Start crafting them.
              </h2>
              <p className="mt-3 max-w-lg mx-auto font-body text-body-lg text-brand-100">
                Free, open source, and running in minutes — in the cloud or on your own machine.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                {!isVercelHost() && (
                  <Link
                    href={auth.isAuthenticated ? "/dashboard" : "/register"}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl bg-white hover:bg-brand-50 text-brand-700 font-label text-label font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{auth.isAuthenticated ? "Open the app" : "Get started free"}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                )}
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto h-11 px-6 rounded-xl border border-white/40 hover:bg-white/10 text-white font-label text-label font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>Self-host it</span>
                  <span className="material-symbols-outlined text-[18px]">dns</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-page font-body text-gray-700 antialiased overflow-x-clip">
      <Navbar />
      <main>
        <Hero />
        <PipelineDemo />
        <Features />
        <ApiSection />
        <SelfHost />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
