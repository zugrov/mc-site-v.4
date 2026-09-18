type CalloutType = "info" | "warning" | "success";

const styles: Record<CalloutType, string> = {
  info: "border-teal-500/40 bg-teal-950/40",
  warning: "border-amber-500/40 bg-amber-950/30",
  success: "border-emerald-500/40 bg-emerald-950/30",
};

export function Callout({
  type = "info",
  children,
}: {
  type?: CalloutType;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`my-6 rounded-lg border-l-4 px-4 py-3 text-sm leading-relaxed ${styles[type]}`}
    >
      {children}
    </div>
  );
}
