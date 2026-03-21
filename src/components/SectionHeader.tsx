interface Props {
  tag?: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ tag, title, subtitle }: Props) {
  return (
    <div className="mb-8">
      {tag && (
        <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">
          {tag}
        </p>
      )}
      <h2 className="font-display font-bold text-headline text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary mt-2 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
