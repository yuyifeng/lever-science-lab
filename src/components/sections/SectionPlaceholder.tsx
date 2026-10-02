import { ArrowUpRight, LockKeyhole, type LucideIcon } from "lucide-react";

interface SectionPlaceholderProps {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  icon: LucideIcon;
  tone?: "blue" | "orange" | "green";
}

const toneClasses = {
  blue: "bg-science text-white",
  orange: "bg-action text-white",
  green: "bg-resistance text-white",
};

export function SectionPlaceholder({
  id,
  number,
  eyebrow,
  title,
  description,
  note,
  icon: Icon,
  tone = "blue",
}: SectionPlaceholderProps) {
  return (
    <section id={id} className="container py-12 tablet:py-16">
      <div className="paper-card grid overflow-hidden desktop:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="p-6 tablet:p-10">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl text-action">{number}</span>
            <span className="h-px w-12 bg-ink/20" />
            <span className="text-xs font-bold tracking-[0.18em] text-muted">
              {eyebrow}
            </span>
          </div>
          <h2 className="section-title mt-5">{title}</h2>
          <p className="body-copy mt-4 max-w-2xl">{description}</p>

          <div className="mt-8 flex items-center gap-3 rounded-lg border border-dashed border-ink/25 bg-paper/60 p-4 text-sm font-semibold text-muted">
            <LockKeyhole aria-hidden="true" className="size-5 shrink-0" />
            <span>{note}</span>
          </div>
        </div>

        <div
          className={`relative grid min-h-52 place-items-center overflow-hidden ${toneClasses[tone]}`}
          aria-hidden="true"
        >
          <span className="absolute -right-6 -top-12 font-display text-[11rem] leading-none text-white/10">
            {number}
          </span>
          <div className="relative grid size-24 place-items-center rounded-lg border-2 border-white/40 bg-white/10">
            <Icon className="size-12" strokeWidth={1.8} />
          </div>
          <ArrowUpRight className="absolute bottom-6 right-6 size-7 opacity-60" />
        </div>
      </div>
    </section>
  );
}
