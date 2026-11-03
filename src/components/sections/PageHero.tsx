import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: Crumb[];
  image?: { src: string; alt: string; focus?: string };
  /**
   * - `split`: text left, framed glass image right (About, entity, founder)
   * - `cinematic`: full-bleed photo behind the text (industry pages)
   * - `typographic`: grid + light only (directory, industries, contact)
   */
  variant?: "split" | "cinematic" | "typographic";
  children?: ReactNode;
};

/** Inner-page hero in three compositions sharing one atmosphere. */
export function PageHero({ eyebrow, title, lead, crumbs, image, variant = "typographic", children }: Props) {
  const heading = (
    <>
      <p
        className="enter-fade-up glass label-mono mt-8 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] text-fg-muted"
        style={{ "--enter-delay": "0.1s" } as React.CSSProperties}
      >
        <span className="size-1.5 rounded-full bg-accent" aria-hidden />
        {eyebrow}
      </p>
      <h1 className="display-hero mt-6 text-balance">
        <span className="line-mask">
          <span>{title}</span>
        </span>
      </h1>
      {lead && (
        <div
          className="enter-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted text-pretty"
          style={{ "--enter-delay": "0.4s" } as React.CSSProperties}
        >
          {lead}
        </div>
      )}
      {children && (
        <div className="enter-fade-up mt-9" style={{ "--enter-delay": "0.55s" } as React.CSSProperties}>
          {children}
        </div>
      )}
    </>
  );

  const atmosphere = (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="tech-grid absolute inset-0" />
      <div
        className="absolute -right-[20%] -top-[30vh] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgb(36 99 234 / 0.13), transparent 70%)",
          animation: "glow-drift 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -left-[25%] top-[25vh] h-[50vmax] w-[50vmax] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(29 157 241 / 0.1), transparent 70%)" }}
      />
    </div>
  );

  if (variant === "cinematic" && image) {
    return (
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden lg:min-h-[86svh]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload
          sizes="100vw"
          className="enter-fade -z-20 object-cover opacity-60 [filter:grayscale(0.35)_contrast(1.08)]"
          style={{ objectPosition: image.focus }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-page via-page/70 to-page/30" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-page/85 to-transparent" />
        {/* Scrim so the floating navigation stays legible over bright photos */}
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-page/90 to-transparent" />
        <div className="container-x pb-14 pt-[calc(var(--header-h)+3rem)] lg:pb-20">
          <Breadcrumbs items={crumbs} />
          {heading}
        </div>
      </section>
    );
  }

  if (variant === "split" && image) {
    return (
      <section className="relative isolate overflow-hidden">
        {atmosphere}
        <div className="container-x grid gap-12 pb-14 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:items-center lg:gap-16 lg:pb-20">
          <div className="lg:col-span-7">
            <Breadcrumbs items={crumbs} />
            {heading}
          </div>
          <div className="lg:col-span-5">
            <div
              className="enter-fade glass relative mx-auto max-w-sm rounded-[2rem] p-2 lg:max-w-none"
              style={{ "--enter-delay": "0.25s" } as React.CSSProperties}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  preload
                  sizes="(min-width: 1024px) 38vw, 80vw"
                  className="object-cover"
                  style={{ objectPosition: image.focus }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-page/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden">
      {atmosphere}
      <div className="container-x pb-14 pt-[calc(var(--header-h)+3rem)] lg:pb-20">
        <Breadcrumbs items={crumbs} />
        {heading}
      </div>
    </section>
  );
}
