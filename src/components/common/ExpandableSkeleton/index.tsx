import { FC, ReactNode } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/Skeleton';

interface ExpandableSectionSkeletonProps {
  title?: string;
  status?: ReactNode;
}

const ExpandableSectionSkeleton: FC<ExpandableSectionSkeletonProps> = () => {
  return (
    <Collapsible className="ring-1 ring-slate-300 rounded-md animate-pulse">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between w-full px-4 py-3 border-b border-slate-200 cursor-pointer">
          <div className="flex items-center gap-2">
            <Skeleton className="w-32 h-6 bg-slate-200 rounded-md" />
          </div>
          <Skeleton className="w-20 h-6 bg-slate-200 rounded-md" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-5">
        <div className="flex flex-col space-y-3">
          <Skeleton className="w-full h-6 bg-slate-200 rounded-md" />
          <Skeleton className="w-3/4 h-6 bg-slate-200 rounded-md" />
          <Skeleton className="w-1/2 h-6 bg-slate-200 rounded-md" />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ExpandableSectionSkeleton;
