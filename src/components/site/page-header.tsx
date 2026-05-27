import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  children,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "container-page pt-10 pb-8 md:pt-16 md:pb-10 animate-appear",
        align === "center" && "text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "mb-3 inline-flex items-center rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {eyebrow}
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            "mt-3 text-muted-foreground max-w-2xl",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}
