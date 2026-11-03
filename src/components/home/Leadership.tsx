import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { founder } from "@/content/story";
import { site } from "@/content/site";

export function Leadership() {
  return (
    <section aria-labelledby="leadership-title" className="cv-auto relative overflow-hidden bg-page-alt py-24 sm:py-32 lg:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-[12rem] size-[44rem] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(29 157 241 / 0.12), transparent 70%)" }}
      />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div data-reveal="scale" className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <div className="glass relative overflow-hidden rounded-[2rem] p-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
              <Image
                src={founder.portrait}
                alt="Portrait of Dr. Daniel Davidson, Founder and Director of American Elite Enterprises"
                fill
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="object-cover"
                style={{ objectPosition: "50% 12%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-page/80 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 label-mono text-[0.68rem] text-accent">{founder.role}</p>
            </div>
          </div>
          <div
            aria-hidden
            className="absolute -inset-px -z-10 rounded-[2rem] bg-gradient-to-br from-accent/40 via-transparent to-azure/30 blur-xl"
          />
        </div>

        <div className="lg:col-span-7">
          <p data-reveal className="glass label-mono inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] text-fg-muted">
            <span className="text-accent">05</span>
            <span aria-hidden className="h-3 w-px bg-line-strong" />
            Leadership
          </p>
          <h2 id="leadership-title" data-reveal style={{ "--reveal-delay": 1 } as React.CSSProperties} className="display-lg mt-5">
            {founder.name}
          </h2>

          <blockquote
            data-reveal
            style={{ "--reveal-delay": 2 } as React.CSSProperties}
            className="mt-8 border-l-2 border-accent pl-6"
          >
            <p className="font-display text-2xl font-medium leading-snug tracking-tight text-fg sm:text-3xl">
              “{founder.motto}.”
            </p>
            <footer className="mt-2 text-sm text-fg-subtle">The motto Dr. Davidson lives by</footer>
          </blockquote>

          <p data-reveal style={{ "--reveal-delay": 3 } as React.CSSProperties} className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted">
            A business engineer and executive administrator with an extensive healthcare
            background, Dr. Davidson founded American Elite and still directs it today. After
            years practicing medicine and surgery in Los Angeles, he has dedicated his career to
            building businesses, optimizing them, teaching and supporting charitable work.
          </p>

          <ul data-reveal style={{ "--reveal-delay": 3 } as React.CSSProperties} aria-label="Degrees" className="mt-8 flex flex-wrap gap-2">
            {founder.credentials.map((c) => (
              <li key={c} className="rounded-full border border-line bg-tint px-3.5 py-1.5 font-mono text-xs text-fg/85">
                {c}
              </li>
            ))}
          </ul>

          <div data-reveal style={{ "--reveal-delay": 4 } as React.CSSProperties} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/dr-daniel-davidson/">Read the full profile</ButtonLink>
            <ButtonLink href={site.founder.website} external variant="glass">
              DrAmericanElite.com
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
