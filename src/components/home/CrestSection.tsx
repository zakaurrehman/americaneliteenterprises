import { Star } from "@/components/ui/icons";
import { sectors, totalCompanies } from "@/content/portfolio";
import { Orbit } from "./Orbit";

// The meaning of each symbol, as given by Dr. Daniel Davidson.
const symbols = [
  {
    numeral: "I",
    name: "The crown",
    text: `American Elite Enterprises at the head of the entire ecosystem: one group leading ${totalCompanies} businesses across ${sectors.length} sectors, each with its own name, identity and legacy.`,
  },
  {
    numeral: "II",
    name: "The lion",
    text: "Lion Pride Leadership: strength, leadership and excellence.",
  },
  {
    numeral: "III",
    name: "The flag and stars",
    text: "An American identity: the flag, the stars and the gold of an enterprise built in Los Angeles since 1991.",
  },
];

/** The crest explained, beside the orbit of every business around it. */
export function CrestSection() {
  return (
    <section aria-labelledby="crest-section-title" className="cv-auto relative isolate overflow-hidden bg-navy-deep py-24 text-on-accent sm:py-32">
      <div aria-hidden className="tech-grid absolute inset-0 -z-10 opacity-60" />
      <div
        aria-hidden
        className="absolute left-1/4 top-1/2 -z-10 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(201 162 74 / 0.14), transparent 70%)" }}
      />

      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div data-reveal="fade" className="mx-auto w-full max-w-[26rem] sm:max-w-[32rem] lg:col-span-6 lg:max-w-[38rem]">
          <Orbit />
        </div>

        <div className="lg:col-span-6">
          <p data-reveal className="label-mono inline-flex items-center gap-3 text-gold">
            <Star width={11} height={11} aria-hidden />
            The American Elite crest
          </p>
          <h2 id="crest-section-title" data-reveal className="display-lg mt-5 text-balance">
            One crown at the head of the <em className="font-medium text-gold">whole group.</em>
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-lg leading-relaxed text-on-accent/80">
            Every element of the crest carries meaning. Around it, each business keeps its own
            name and logo, and all of them share one heritage.
          </p>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            {symbols.map((s, i) => (
              <div
                key={s.name}
                data-reveal
                style={{ "--reveal-delay": i } as React.CSSProperties}
                className="grid grid-cols-[3rem_1fr] gap-x-4 bg-navy-deep/95 p-6 sm:grid-cols-[3.5rem_1fr]"
              >
                <span aria-hidden className="row-span-2 font-heritage text-2xl font-bold text-gold">
                  {s.numeral}
                </span>
                <dt className="font-display text-xl font-semibold">{s.name}</dt>
                <dd className="mt-1.5 leading-relaxed text-on-accent/75">{s.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
