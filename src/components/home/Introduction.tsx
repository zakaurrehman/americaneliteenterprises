import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { LitStatement } from "./Statement";

export function Introduction() {
  return (
    <section aria-labelledby="intro-title" className="cv-auto relative py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <h2 id="intro-title" data-reveal className="glass label-mono inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] text-fg-muted">
          <span className="text-accent">01</span>
          <span aria-hidden className="h-3 w-px bg-line-strong" />
          Introducing American Elite
        </h2>

        <LitStatement
          className="mt-8 max-w-5xl font-display text-[clamp(1.4rem,2.6vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.01em] text-fg text-balance"
          text="American Elite Enterprises is a private group of businesses that has been around since 1991 in various forms — the parent organization of companies across healthcare, business, technology, charities, legal services, consulting, e-commerce, education and inventions."
        />

        <div className="mt-16 grid gap-4 md:grid-cols-3 lg:mt-24">
          <article data-reveal className="glass spotlight relative overflow-hidden rounded-3xl p-7 md:col-span-2 md:row-span-2 md:min-h-[26rem]">
            <Image
              src="/images/sectors/los-angeles.webp"
              alt="Los Angeles hills at sunset, home of American Elite's headquarters"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover opacity-60"
              style={{ objectPosition: "50% 60%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-page via-page/50 to-transparent" />
            <div className="relative flex h-full min-h-[18rem] flex-col justify-end">
              <p className="label-mono text-[0.68rem] text-accent">Headquarters</p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Los Angeles, California
              </h3>
              <p className="mt-3 max-w-md text-fg-muted">
                The group has gone through a long series of transformations, enhancements and
                expansions — and is still headquartered in Los Angeles.
              </p>
            </div>
          </article>

          <article data-reveal style={{ "--reveal-delay": 1 } as React.CSSProperties} className="glass spotlight relative overflow-hidden rounded-3xl p-7">
            <p className="label-mono text-[0.68rem] text-fg-subtle">Since</p>
            <p className="mt-4 font-display text-5xl font-semibold tracking-tight text-accent-gradient">1991</p>
            <p className="mt-4 text-fg-muted">
              In business for more than three decades, in various forms.
            </p>
          </article>

          <article data-reveal style={{ "--reveal-delay": 2 } as React.CSSProperties} className="glass spotlight relative overflow-hidden rounded-3xl p-7">
            <p className="label-mono text-[0.68rem] text-fg-subtle">Founder &amp; Director</p>
            <p className="mt-4 font-display text-2xl font-semibold tracking-tight">Dr. Daniel Davidson</p>
            <p className="mt-2 text-fg-muted">MBA · DBA · PhD in Marketing</p>
            <Link href="/about/" className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
              Our story
              <ArrowRight width={16} height={16} className="arrow-nudge" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
