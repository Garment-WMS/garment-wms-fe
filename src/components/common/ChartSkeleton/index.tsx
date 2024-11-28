import { Skeleton } from '@/components/ui/skeleton';

const ChartSkeleton = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center space-x-8">
          {/* Pie chart skeleton */}
          <div className="relative">
            <Skeleton className="w-64 h-64 rounded-full" /> {/* Increased size */}
            <Skeleton className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Legend skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Skeleton className="w-6 h-6 rounded-sm" /> {/* Larger legend icons */}
                <Skeleton className="w-32 h-6" /> {/* Larger legend text */}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <Skeleton className="w-64 h-8 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
