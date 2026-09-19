import { useState } from 'react';
import { Check, CircleAlert, Clock3, DoorOpen, Users, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from 'cn';

import {
  BOOKING_ROOMS,
  BOOKING_SLOTS,
  bookingDateLabel,
  cellKey,
  useBookingStore,
  type BookingRecord,
} from './store';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MAX_DAYS = 7;

/** Smart defaults: the most common booking reasons, one tap away. The first
 *  is pre-selected so the form is never empty. */
const BOOKING_PURPOSES = [
  'Group study',
  'Lecture revision',
  'Project work',
  'Society meeting',
  'Quiet study',
] as const;

const bookingSchema = z.object({
  purpose: z
    .string()
    .trim()
    .min(3, 'Add a purpose (at least 3 characters)')
    .max(120, 'Purpose must be 120 characters or fewer'),
  groupSize: z.string().refine((v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= 40;
  }, 'Enter a group size between 1 and 40'),
  notes: z.string().trim().max(300, 'Keep notes under 300 characters').optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingGridPage() {
  const [dateOffset, setDateOffset] = useState(0);

  const selection = useBookingStore((s) => s.selection);
  const bookings = useBookingStore((s) => s.bookings);
  const isOccupied = useBookingStore((s) => s.isOccupied);
  const isSelected = useBookingStore((s) => s.isSelected);
  const toggleSlot = useBookingStore((s) => s.toggleSlot);

  const days = Array.from({ length: MAX_DAYS }, (_, i) => bookingDateLabel(i));

  const confirmed = bookings.filter((b) => b.dateOffset === dateOffset);
  const selectedCount = Object.values(selection).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Book a classroom
        </h1>
        <p className="text-sm text-muted-foreground">
          Check real-time availability across campus rooms and reserve a space for study or group
          work — no admin request needed. Select free slots, then confirm in a few seconds.
        </p>
      </div>

      {/* Day selector */}
      <div className="flex flex-wrap gap-2">
        {days.map((label, i) => {
          const selected = i === dateOffset;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setDateOffset(i)}
              aria-pressed={selected}
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {label}
              {i === 0 ? (
                <span
                  className={cn(
                    'ml-1.5 text-xs',
                    selected ? 'text-primary-foreground/70' : 'text-muted-foreground',
                  )}
                >
                  today
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <DoorOpen className="size-4 text-primary" />
              Availability — {days[dateOffset]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1.5 text-left align-bottom text-xs font-medium text-muted-foreground">
                      <Clock3 className="mb-1 size-3.5 inline" /> Time / room
                    </th>
                    {BOOKING_ROOMS.map((room) => (
                      <th
                        key={room.id}
                        className="px-1.5 py-1.5 text-center align-bottom font-medium"
                      >
                        <span className="block leading-tight">{room.name}</span>
                        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                          {room.building} · {room.capacity} seats
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BOOKING_SLOTS.map((slot) => (
                    <tr key={slot.index}>
                      <td className="px-2 py-1 text-xs whitespace-nowrap text-muted-foreground">
                        {slot.label}
                      </td>
                      {BOOKING_ROOMS.map((room) => {
                        const key = cellKey(room.id, dateOffset, slot.index);
                        const occupied = isOccupied(room.id, dateOffset, slot.index);
                        const selected = isSelected(room.id, dateOffset, slot.index);
                        return (
                          <td key={key} className="p-1">
                            <button
                              type="button"
                              disabled={occupied}
                              aria-pressed={selected}
                              aria-label={`${room.name} ${slot.label} on ${days[dateOffset]} — ${
                                occupied ? 'occupied' : selected ? 'selected' : 'free'
                              }`}
                              onClick={() => toggleSlot(room.id, dateOffset, slot.index)}
                              className={cn(
                                'flex h-9 w-full items-center justify-center rounded-md border text-sm transition-colors',
                                occupied
                                  ? 'cursor-not-allowed border-transparent bg-muted text-muted-foreground/40'
                                  : selected
                                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'border-input bg-background text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-foreground',
                              )}
                            >
                              {occupied ? (
                                <X className="size-3.5" strokeWidth={2.5} />
                              ) : selected ? (
                                <Check className="size-3.5" strokeWidth={2.5} />
                              ) : null}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block size-3 rounded border border-input bg-background" />{' '}
                Free
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block size-3 rounded bg-primary" /> Selected
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block size-3 rounded bg-muted" /> Occupied
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Check className="size-4 text-primary" />
                My bookings
              </CardTitle>
              {selectedCount > 0 ? (
                <button
                  type="button"
                  onClick={() => useBookingStore.getState().clearSelection()}
                  className="text-xs font-medium text-destructive hover:underline"
                >
                  Clear
                </button>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedCount > 0 ? (
                <p className="rounded-md bg-warning/10 px-2.5 py-2 text-xs text-warning-foreground">
                  <CircleAlert className="mr-1 inline size-3.5" />
                  {selectedCount} slot{selectedCount === 1 ? '' : 's'} selected — confirm below to
                  reserve.
                </p>
              ) : null}
              {confirmed.length === 0 ? (
                <p className="py-3 text-center text-sm text-muted-foreground">
                  No bookings for this day yet.
                </p>
              ) : (
                confirmed.map((b) => <BookingRow key={b.id} booking={b} />)
              )}
            </CardContent>
          </Card>

          <BookingConfirmCard />
        </div>
      </div>
    </div>
  );
}

function BookingRow({ booking }: { booking: BookingRecord }) {
  const room = BOOKING_ROOMS.find((r) => r.id === booking.roomId);
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{booking.slotLabel}</span>
        <Badge variant="secondary">{bookingDateLabel(booking.dateOffset)}</Badge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {room?.name ?? booking.roomName} · {room?.building ?? 'Campus'}
      </p>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Users className="size-3.5" />
        <span>
          {booking.groupSize} {booking.groupSize === 1 ? 'person' : 'people'}
        </span>
        <span>·</span>
        <span className="truncate text-foreground/80">{booking.purpose}</span>
      </div>
    </div>
  );
}

function BookingConfirmCard() {
  const [open, setOpen] = useState(false);

  const toggleSlot = useBookingStore((s) => s.toggleSlot);
  const selection = useBookingStore((s) => s.selection);

  const selectedKeys = Object.keys(selection).filter((k) => selection[k]);
  const disabled = selectedKeys.length === 0;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">Reserve a slot</CardTitle>
        <p className="text-xs text-muted-foreground">
          Pick free slots in the grid, then confirm your booking.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {selectedKeys.length > 0 ? (
          <ul className="space-y-1 text-xs text-muted-foreground">
            {selectedKeys.slice(0, 6).map((k) => {
              const [roomId, offset, slotIndex] = k.split(':');
              const room = BOOKING_ROOMS.find((r) => r.id === roomId);
              const slot = BOOKING_SLOTS.find((s) => s.index === Number(slotIndex));
              return (
                <li key={k} className="flex items-center justify-between gap-2">
                  <span>
                    {room?.name} · {slot?.label} · {bookingDateLabel(Number(offset))}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSlot(roomId, Number(offset), Number(slotIndex))}
                    className="text-destructive hover:underline"
                    aria-label="Remove slot"
                  >
                    remove
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-2 text-center text-xs text-muted-foreground">Nothing selected yet.</p>
        )}

        {selectedKeys.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Selected slots are not held yet — confirm to reserve them before someone else books.
          </p>
        ) : null}

        <BookingDialog open={open} onOpenChange={setOpen} />

        <Button type="button" className="w-full" disabled={disabled} onClick={() => setOpen(true)}>
          Continue with {selectedKeys.length} slot{selectedKeys.length === 1 ? '' : 's'}
        </Button>
      </CardContent>
    </Card>
  );
}

function BookingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const confirm = useBookingStore((s) => s.confirm);
  const selection = useBookingStore((s) => s.selection);
  const clearSelection = useBookingStore((s) => s.clearSelection);

  const selectedKeys = Object.keys(selection).filter((k) => selection[k]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      purpose: BOOKING_PURPOSES[0],
      groupSize: '4',
      notes: '',
    },
  });

  function onSubmit(values: BookingFormValues) {
    for (const key of selectedKeys) {
      const [roomId, offset, slotIndex] = key.split(':');
      confirm({
        roomId,
        dateOffset: Number(offset),
        slotIndex: Number(slotIndex),
        purpose: values.purpose,
        groupSize: Number(values.groupSize),
        notes: values.notes,
      });
    }
    form.reset();
    clearSelection();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Confirm {selectedKeys.length > 0 ? selectedKeys.length : ''} booking
          </DialogTitle>
          <DialogDescription>
            {selectedKeys.length > 0
              ? 'Your selected slots will be reserved for the purpose below.'
              : 'No slots selected on this day.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {BOOKING_PURPOSES.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => form.setValue('purpose', preset, { shouldValidate: true })}
                        className={cn(
                          'rounded-full border px-2.5 py-1 text-xs transition-colors',
                          field.value === preset
                            ? 'border-primary bg-primary/10 font-medium text-primary'
                            : 'border-input bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground',
                        )}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  <FormControl>
                    <Input placeholder="Or type a custom purpose" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group size</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={40} inputMode="numeric" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Anything the room staff should know"
                      className="min-h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={selectedKeys.length === 0}>
                Confirm booking
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
