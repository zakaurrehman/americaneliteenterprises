import { founder } from "@/content/story";

// Four principles drawn from Dr. Davidson's own description of the group's work.
const principles = [
  {
    title: "Build",
    body: "Help businesses begin from the ground up — from the point where they are only an idea to the point where they are efficient and profitable.",
  },
  {
    title: "Optimize",
    body: "Analyze processes, find bottlenecks and streamline operations, combining data with an understanding of the people and organizations behind them.",
  },
  {
    title: "Teach",
    body: "Share knowledge through education and training, helping professionals move from job dependence to financial independence.",
  },
  {
    title: "Serve",
    body: "Support people in need through charitable work — regardless of race, color, religion or any other factor.",
  },
];

export function Philosophy() {
  return (
    <section aria-labelledby="philosophy-title" className="cv-auto relative py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <p data-reveal className="glass label-mono inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] text-fg-muted">
          <span className="text-accent">06</span>
          <span aria-hidden className="h-3 w-px bg-line-strong" />
          Our philosophy
        </p>
        <h2 id="philosophy-title" className="sr-only">
          Our philosophy
        </h2>
        <figure className="mt-8 max-w-5xl">
          <blockquote
            data-reveal
            style={{ "--reveal-delay": 1 } as React.CSSProperties}
            className="font-display text-[clamp(1.7rem,3.8vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.035em] text-fg"
          >
            “{founder.quote}”
          </blockquote>
          <figcaption data-reveal style={{ "--reveal-delay": 2 } as React.CSSProperties} className="mt-6 flex items-center gap-3 text-sm text-fg-subtle">
            <span aria-hidden className="h-px w-10 bg-accent" />
            {founder.name}, on what he was put on this earth to do
          </figcaption>
        </figure>

        <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {principles.map((p, i) => (
            <li
              key={p.title}
              data-reveal
              style={{ "--reveal-delay": i } as React.CSSProperties}
              className="glass spotlight edge-light group relative overflow-hidden rounded-2xl p-7"
            >
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-10 font-display text-3xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-fg-muted">{p.body}</p>
              <span
                aria-hidden
                className="absolute -right-6 -top-8 font-display text-[7rem] font-bold leading-none text-fg/[0.04] transition-colors duration-500 group-hover:text-accent/[0.08]"
              >
                {i + 1}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
