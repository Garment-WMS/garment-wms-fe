import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TaskListSkeleton() {
  return (
    <div className="w-full  mx-auto space-y-4 p-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex items-start gap-4">
          <div className="w-40 flex flex-col items-start">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
          <Card className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Skeleton className="w-5 h-5 mt-1 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
