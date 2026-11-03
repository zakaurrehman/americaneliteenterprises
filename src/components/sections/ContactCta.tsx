import { ButtonLink } from "@/components/ui/Button";
import { Mail, Phone, Pin } from "@/components/ui/icons";
import { addressLine, site } from "@/content/site";

/** Closing call to action used on the homepage and inner pages. */
export function ContactCta({ index }: { index?: string }) {
  return (
    <section aria-labelledby="cta-title" className="cv-auto relative py-20 sm:py-28">
      <div className="container-x">
        <div className="glass relative isolate overflow-hidden rounded-[2rem] px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="tech-grid absolute inset-0 opacity-70" />
            <div
              className="absolute -right-1/4 -top-[25rem] size-[50rem] rounded-full"
              style={{
                background: "radial-gradient(closest-side, rgb(36 99 234 / 0.22), transparent 70%)",
                animation: "glow-drift 18s ease-in-out infinite",
              }}
            />
            <div
              className="absolute -bottom-[22rem] -left-1/4 size-[44rem] rounded-full"
              style={{ background: "radial-gradient(closest-side, rgb(29 157 241 / 0.16), transparent 70%)" }}
            />
          </div>

          <p data-reveal className="glass label-mono inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] text-fg-muted">
            {index && <span className="text-accent">{index}</span>}
            {index && <span aria-hidden className="h-3 w-px bg-line-strong" />}
            Connect with us
          </p>
          <h2
            id="cta-title"
            data-reveal
            style={{ "--reveal-delay": 1 } as React.CSSProperties}
            className="display-hero mt-6 max-w-4xl text-balance"
          >
            Let&apos;s start a <span className="text-accent-gradient">conversation.</span>
          </h2>
          <p data-reveal style={{ "--reveal-delay": 2 } as React.CSSProperties} className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            Whether you are a business owner, a professional, a potential partner or simply curious
            about the group, we would be glad to hear from you.
          </p>
          <div data-reveal style={{ "--reveal-delay": 3 } as React.CSSProperties} className="mt-10">
            <ButtonLink href="/contact/" magnetic className="min-h-14 px-8 text-base">
              Contact American Elite
            </ButtonLink>
          </div>

          <ul className="mt-14 grid gap-3 md:grid-cols-3">
            <ContactItem icon={<Phone />} label="Call" href={site.contact.phoneHref}>
              {site.contact.phoneDisplay}
            </ContactItem>
            <ContactItem icon={<Mail />} label="Email" href={site.contact.emailHref}>
              <span className="[overflow-wrap:anywhere]">{site.contact.email}</span>
            </ContactItem>
            <ContactItem icon={<Pin />} label="Visit">
              {addressLine}
            </ContactItem>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  href,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="label-mono block text-[0.62rem] text-fg-subtle">{label}</span>
        <span className="mt-1 block text-[0.95rem] text-fg">{children}</span>
      </span>
    </>
  );
  const cls = "flex h-full items-center gap-4 rounded-2xl border border-line bg-page/60 p-5";
  return (
    <li>
      {href ? (
        <a href={href} className={`${cls} transition-colors duration-300 hover:border-accent/40`}>
          {inner}
        </a>
      ) : (
        <div className={cls}>{inner}</div>
      )}
    </li>
  );
}
