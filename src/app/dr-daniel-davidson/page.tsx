import { ContactCta } from "@/components/sections/ContactCta";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { founder } from "@/content/story";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Dr. Daniel Davidson — Founder & Director",
  description:
    "Dr. Daniel Davidson is the Founder and Director of American Elite Enterprises: a business engineer and executive administrator with an extensive healthcare background.",
  path: "/dr-daniel-davidson/",
});

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: founder.name,
  jobTitle: founder.role,
  url: `${site.url}/dr-daniel-davidson/`,
  image: `${site.url}${founder.portrait}`,
  sameAs: [site.founder.website],
  worksFor: { "@id": `${site.url}/#organization` },
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of California, Irvine" },
};

export default function FounderPage() {
  return (
    <>
      <JsonLd data={personJsonLd} />
      <PageHero
        variant="split"
        image={{
          src: founder.portrait,
          alt: "Portrait of Dr. Daniel Davidson",
          focus: "50% 10%",
        }}
        crumbs={[{ name: "Leadership", path: "/dr-daniel-davidson/" }]}
        eyebrow={`Leadership · ${founder.role}`}
        title={founder.name}
        lead={founder.headline}
      >
        <ul aria-label="Degrees" className="flex flex-wrap gap-2">
          {founder.credentials.map((c) => (
            <li key={c} className="rounded-full border border-line-strong px-4 py-1.5 text-sm text-fg/85">
              {c}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav aria-label="On this page" className="lg:sticky lg:top-28">
              <p className="label-mono text-accent">On this page</p>
              <ol className="mt-5 space-y-1 border-l border-line">
                {founder.sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px flex min-h-10 items-center gap-3 border-l border-transparent pl-4 text-sm text-fg-muted transition-colors hover:border-accent hover:text-fg"
                    >
                      <span className="tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-10 hidden lg:block">
                <ButtonLink href={site.founder.website} external variant="glass">
                  DrAmericanElite.com
                </ButtonLink>
              </div>
            </nav>
          </aside>

          <article className="lg:col-span-8 lg:col-start-5">
            {founder.sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className={i > 0 ? "mt-20" : ""}>
                <h2 id={`${s.id}-title`} data-reveal className="display-md text-fg">
                  {s.title}
                </h2>
                <div className="prose-editorial mt-8 text-fg-muted">
                  {s.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} data-reveal>
                      {p}
                    </p>
                  ))}
                </div>

                {i === 0 && (
                  <figure data-reveal className="my-16 border-y border-line py-12">
                    <blockquote className="font-display text-xl font-medium leading-snug tracking-tight text-fg sm:text-2xl">
                      “I am truly doing what I was put on this earth to do. To build businesses,
                      to optimize them, to teach self-help and entrepreneurship, and to
                      participate in charitable services, helping the world!”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-4 text-sm text-fg-muted">
                      <span aria-hidden className="h-px w-10 bg-accent" />
                      Dr. Daniel Davidson
                    </figcaption>
                  </figure>
                )}
              </section>
            ))}

            <div className="mt-16 lg:hidden">
              <ButtonLink href={site.founder.website} external variant="glass">
                DrAmericanElite.com
              </ButtonLink>
            </div>
          </article>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
