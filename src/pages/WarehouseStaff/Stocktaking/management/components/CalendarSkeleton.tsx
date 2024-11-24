import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarSkeleton() {
  return (
    <div className="w-full ">
      <div className="grid grid-cols-7 gap-px bg-muted">
        {/* Header row */}
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div key={day} className="bg-white p-2 text-center">
            <Skeleton className="h-6 w-12 mx-auto" />
          </div>
        ))}

        {/* Calendar days */}
        {Array.from({ length: 35 }, (_, i) => (
          <div
            key={i}
            className="p-2 border bg-white rounded-sm cursor-pointer shadow-sm flex flex-col gap-2 items-end ">
            <Skeleton className="h-8 w-8 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
