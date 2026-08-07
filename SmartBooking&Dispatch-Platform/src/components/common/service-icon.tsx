import { Wrench, Zap, Flame, Sparkles, KeyRound, type LucideProps } from "lucide-react";

const ICONS = {
  Wrench,
  Zap,
  Flame,
  Sparkles,
  KeyRound,
} as const;

export function ServiceIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICONS[name as keyof typeof ICONS] ?? Wrench;
  return <Icon {...props} />;
}
