import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { entities } from "@/content/entities";
import { sectorHref, sectors } from "@/content/portfolio";
import { addressLine, mainNav, site } from "@/content/site";
import lockup from "../../../public/brand/american-elite-lockup.png";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-page text-fg-muted">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />
      <div className="container-x pb-10 pt-20 lg:pt-24">
        <div className="grid gap-14 pb-14 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-5">
            <Image
              src={lockup}
              alt="American Elite Enterprises"
              sizes="304px"
              className="h-auto w-[19rem] max-w-full"
            />
            <p className="mt-6 max-w-sm leading-relaxed">
              A private group of businesses headquartered in Los Angeles, California — with roots
              dating back to 1991.
            </p>
            <address className="mt-8 grid gap-2 text-sm not-italic">
              <a href={site.contact.phoneHref} className="w-fit text-fg hover:text-accent">
                {site.contact.phoneDisplay}
              </a>
              <a href={site.contact.emailHref} className="w-fit text-fg [overflow-wrap:anywhere] hover:text-accent">
                {site.contact.email}
              </a>
              <span>{addressLine}</span>
            </address>
          </div>

          <nav
            aria-label="Footer"
            data-reveal
            style={{ "--reveal-delay": 1 } as React.CSSProperties}
            className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7"
          >
            <FooterColumn title="Industries">
              {sectors.map((s) => (
                <FooterLink key={s.slug} href={sectorHref(s.slug)}>
                  {s.name}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn title="Core entities">
              {entities.map((e) => (
                <FooterLink key={e.slug} href={`/${e.slug}/`}>
                  {e.name.replace("American Elite – ", "")}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn title="Navigate">
              {mainNav.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {item.label}
                </FooterLink>
              ))}
              <FooterLink href="/companies/">Company directory</FooterLink>
            </FooterColumn>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-8 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {site.name}. All rights reserved.
          </p>
          <p className="text-fg-subtle">Los Angeles, California · Since 1991</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-mono text-[0.68rem] text-accent">{title}</p>
      <ul className="mt-5 space-y-0.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="inline-flex min-h-9 items-center text-[0.92rem] text-fg-muted transition-colors duration-300 hover:text-fg">
        {children}
      </Link>
    </li>
  );
}
