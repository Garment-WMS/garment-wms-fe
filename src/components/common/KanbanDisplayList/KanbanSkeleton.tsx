import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Search, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

export default function KanbanSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array(16)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="w-16 h-16 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft size={20} />
          </Button>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
