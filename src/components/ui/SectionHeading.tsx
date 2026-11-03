import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center" | "split";
  as?: "h1" | "h2";
  id?: string;
};

/** Section heading: mono eyebrow chip, display title and optional lead. */
export function SectionHeading({ eyebrow, index, title, lead, align = "left", as: Tag = "h2", id }: Props) {
  const center = align === "center";
  return (
    <div
      className={
        align === "split"
          ? "grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12"
          : center
            ? "mx-auto max-w-3xl text-center"
            : "max-w-3xl"
      }
    >
      <div className={align === "split" ? "lg:col-span-7" : ""}>
        <p
          data-reveal
          className="glass label-mono inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.68rem] text-fg-muted"
        >
          {index && <span className="text-accent">{index}</span>}
          {index && <span aria-hidden className="h-3 w-px bg-line-strong" />}
          {eyebrow}
        </p>
        <Tag
          id={id}
          data-reveal
          style={{ "--reveal-delay": 1 } as React.CSSProperties}
          className="display-lg mt-5 text-balance"
        >
          {title}
        </Tag>
      </div>
      {lead && (
        <div
          data-reveal
          style={{ "--reveal-delay": 2 } as React.CSSProperties}
          className={`${align === "split" ? "lg:col-span-5 lg:pb-2" : "mt-5"} text-lg leading-relaxed text-fg-muted text-pretty`}
        >
          {lead}
        </div>
      )}
    </div>
  );
}
