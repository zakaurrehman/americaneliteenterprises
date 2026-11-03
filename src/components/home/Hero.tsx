import { ButtonLink } from "@/components/ui/Button";
import { sectors, totalCompanies, totalSites } from "@/content/portfolio";
import { Orbit } from "./Orbit";

const stats = [
  { value: "1991", label: "Roots of the group" },
  { value: String(sectors.length), label: "Sectors" },
  { value: String(totalCompanies), label: "Businesses" },
  { value: String(totalSites), label: "Websites" },
  { value: "LA", label: "Headquarters" },
];

export function Hero() {
  const lines = [
    <>{totalCompanies} businesses.</>,
    <>{sectors.length} sectors.</>,
    <>
      <span className="text-accent-gradient">One</span> group.
    </>,
  ];

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Atmosphere: technical grid + two slowly drifting light sources */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="tech-grid absolute inset-0" />
        <div
          className="absolute -right-[15%] top-[-12vh] h-[80vmax] w-[80vmax] rounded-full"
          style={{
            background: "radial-gradient(closest-side, rgb(36 99 234 / 0.16), transparent 70%)",
            animation: "glow-drift 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -left-[20%] top-[40vh] h-[70vmax] w-[70vmax] rounded-full"
          style={{
            background: "radial-gradient(closest-side, rgb(29 157 241 / 0.14), transparent 70%)",
            animation: "glow-drift 26s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="container-x grid items-center gap-10 pb-12 pt-[calc(var(--header-h)+2.5rem)] lg:min-h-[min(100svh,980px)] lg:grid-cols-12 lg:gap-6 lg:pb-16 lg:pt-[calc(var(--header-h)+1rem)]">
        <div className="lg:col-span-6 xl:col-span-6">
          <p
            className="enter-fade-up glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 text-[0.8rem] text-fg-muted"
            style={{ "--enter-delay": "0.05s" } as React.CSSProperties}
          >
            <span className="relative flex size-5 items-center justify-center rounded-full bg-accent/15">
              <span className="size-1.5 rounded-full bg-accent" />
            </span>
            Private enterprise group
            <span aria-hidden className="text-fg-subtle">·</span>
            Los Angeles
            <span aria-hidden className="hidden text-fg-subtle sm:inline">·</span>
            <span className="hidden sm:inline">Since 1991</span>
          </p>

          <h1 id="hero-title" className="display-hero mt-7">
            <span className="sr-only">American Elite Enterprises: </span>
            {lines.map((line, i) => (
              <span key={i} className="line-mask">
                <span style={{ "--line": i } as React.CSSProperties}>{line}</span>
              </span>
            ))}
          </h1>

          <p
            className="enter-fade-up mt-7 max-w-xl text-lg leading-relaxed text-fg-muted text-pretty"
            style={{ "--enter-delay": "0.45s" } as React.CSSProperties}
          >
            American Elite Enterprises is a private group of businesses headquartered in Los
            Angeles — connecting companies, expertise and initiatives across healthcare, business,
            technology, legal services, education, charities and more.
          </p>

          <div
            className="enter-fade-up mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            style={{ "--enter-delay": "0.6s" } as React.CSSProperties}
          >
            <ButtonLink href="/companies/" magnetic>
              Explore our companies
            </ButtonLink>
            <ButtonLink href="/contact/" variant="glass">
              Contact American Elite
            </ButtonLink>
          </div>
        </div>

        <div
          className="enter-fade relative mx-auto w-full max-w-[22rem] sm:max-w-[30rem] lg:col-span-6 lg:max-w-[40rem]"
          style={{ "--enter-delay": "0.2s" } as React.CSSProperties}
        >
          <Orbit />
        </div>
      </div>

      <div className="container-x pb-6">
        <dl
          className="enter-fade-up glass grid grid-cols-2 overflow-hidden rounded-2xl sm:grid-cols-5"
          style={{ "--enter-delay": "0.8s" } as React.CSSProperties}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1 px-5 py-4 sm:px-6 sm:py-5 ${i > 0 ? "sm:border-l sm:border-line" : ""} ${i % 2 === 1 ? "border-l border-line sm:border-l" : ""} ${i < 4 ? "border-b border-line sm:border-b-0" : ""} ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <dt className="label-mono order-2 text-[0.68rem] text-fg-subtle">{s.label}</dt>
              <dd className="order-1 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
