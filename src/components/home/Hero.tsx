import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Star } from "@/components/ui/icons";
import { sectors, totalCompanies, totalSites } from "@/content/portfolio";
import crest from "../../../public/brand/american-elite-crest.png";
import { HeroSlideshow, type Slide } from "./HeroSlideshow";

const stats = [
  { value: "1991", label: "Roots of the group" },
  { value: String(sectors.length), label: "Sectors" },
  { value: String(totalCompanies), label: "Businesses" },
  { value: String(totalSites), label: "Websites" },
  { value: "LA", label: "Headquarters" },
];

// The original website's homepage slideshow (its six largest photos, in its order).
const slides: Slide[] = [
  { src: "/images/heritage/slide-1-arrival.webp", focus: "60% 50%" },
  { src: "/images/heritage/slide-2-estate-garage.webp" },
  { src: "/images/heritage/slide-3-palace-drive.webp" },
  { src: "/images/heritage/slide-4-estate-dusk.webp" },
  { src: "/images/heritage/slide-5-villa-night.webp" },
  { src: "/images/heritage/slide-6-villa-lights.webp" },
];

export function Hero() {
  const lines = [
    <>{totalCompanies} businesses.</>,
    <>{sectors.length} sectors.</>,
    <>
      One <em className="font-medium text-gold">crown.</em>
    </>,
  ];

  return (
    <section aria-labelledby="hero-title" className="relative isolate">
      <div className="relative isolate overflow-hidden text-on-accent min-h-[max(100svh,46rem)] lg:min-h-[min(100svh,960px)]">
        <HeroSlideshow slides={slides} />
        {/* Navy wash: strongest behind the text, so it stays legible on every photo. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(11_22_48/0.8),rgb(11_22_48/0.88))] lg:bg-[linear-gradient(90deg,rgb(11_22_48/0.94)_0%,rgb(11_22_48/0.82)_45%,rgb(11_22_48/0.35)_100%)]"
        />

        <div className="container-x grid min-h-[max(100svh,46rem)] content-start items-start gap-10 lg:content-center lg:items-center pb-24 pt-[calc(var(--header-h)+3rem)] lg:min-h-[min(100svh,960px)] lg:grid-cols-12 lg:gap-8 lg:pt-[calc(var(--header-h)+2rem)]">
          <div className="lg:col-span-7">
            <p
              className="enter-fade-up label-mono inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] text-gold-soft"
              style={{ "--enter-delay": "0.05s" } as React.CSSProperties}
            >
              <span aria-hidden className="flex gap-1 text-gold">
                <Star width={11} height={11} />
                <Star width={11} height={11} />
                <Star width={11} height={11} />
              </span>
              Private enterprise group
              <span aria-hidden>·</span>
              Los Angeles
              <span aria-hidden>·</span>
              Since 1991
            </p>

            <h1 id="hero-title" className="display-hero mt-7 text-on-accent">
              <span className="sr-only">American Elite Enterprises: </span>
              {lines.map((line, i) => (
                <span key={i} className="line-mask">
                  <span style={{ "--line": i } as React.CSSProperties}>{line}</span>
                </span>
              ))}
            </h1>

            <div
              aria-hidden
              className="enter-fade-up mt-8 flex max-w-xs items-center gap-3"
              style={{ "--enter-delay": "0.35s" } as React.CSSProperties}
            >
              <span className="gold-rule flex-1" />
              <Star width={12} height={12} className="text-gold" />
              <span className="gold-rule flex-1" />
            </div>

            <p
              className="enter-fade-up mt-7 max-w-xl text-lg leading-relaxed text-on-accent/90 text-pretty"
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
              <ButtonLink href="/companies/" variant="gold" magnetic>
                Explore our companies
              </ButtonLink>
              <ButtonLink href="/contact/" variant="outline-light">
                Contact American Elite
              </ButtonLink>
            </div>
          </div>

          <div
            className="enter-fade relative mx-auto hidden w-full max-w-[24rem] lg:col-span-5 lg:block"
            style={{ "--enter-delay": "0.25s" } as React.CSSProperties}
          >
            <div aria-hidden className="absolute inset-[8%] -z-10 rounded-full bg-gold/25 blur-3xl" />
            <Image
              src={crest}
              alt="The American Elite Enterprises crest"
              sizes="384px"
              className="h-auto w-full drop-shadow-[0_20px_40px_rgb(0_0_0/0.45)]"
            />
          </div>
        </div>
      </div>

      <div aria-hidden className="flag-rule" />

      <div className="container-x relative z-10 pb-6 pt-6">
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
              <dd className="order-1 font-display text-2xl font-semibold text-fg">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
