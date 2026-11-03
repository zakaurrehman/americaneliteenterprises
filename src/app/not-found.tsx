import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-page text-fg">
      <div className="container-x pt-[var(--header-h)]">
        <p className="label-mono text-accent">Error 404</p>
        <h1 className="display-hero mt-5 max-w-3xl text-balance">
          This page has <span className="text-accent-gradient">moved on.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted">
          The page you were looking for doesn&apos;t exist or may have moved as part of our new
          website. Explore our companies or head back to the homepage.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Back to homepage</ButtonLink>
          <ButtonLink href="/companies/" variant="glass">
            Our companies
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
