import { cn } from '@/lib/utils';

/**
 * UCL logo asset used across the portal header, sidebar and login screen.
 */
export function Crest({ className }: { className?: string }) {
  return (
    <img
      src="/ucl.png"
      alt="UCL logo"
      className={cn('size-9 rounded-md object-contain', className)}
    />
  );
}

export function Brand({
  title = 'University Portal',
  subtitle = 'UCL Campus Portal',
  className,
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <Crest className="size-9 shrink-0" />
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="font-heading truncate text-sm font-semibold text-foreground">{title}</span>
        {subtitle !== '' ? (
          <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
        ) : null}
      </div>
    </div>
  );
}
