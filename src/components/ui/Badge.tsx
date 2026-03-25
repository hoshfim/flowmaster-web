import { cn } from '@/lib/utils';

type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'muted';

const daisy: Record<BadgeVariant, string> = {
  green: 'badge badge-success badge-outline',
  amber: 'badge badge-warning badge-outline',
  red:   'badge badge-error badge-outline',
  blue:  'badge badge-info badge-outline',
  muted: 'badge badge-ghost',
};

export function Badge({ variant = 'muted', children, className }: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(daisy[variant], 'gap-1 text-[0.64rem]', className)}>
      {children}
    </span>
  );
}
