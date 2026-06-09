export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">{eyebrow}</p> : null}
      <h2 className="text-2xl font-bold tracking-normal sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p> : null}
    </div>
  );
}
