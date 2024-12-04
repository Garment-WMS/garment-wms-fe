import { Clock, ArrowDownCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'AWAIT_TO_EXPORT' | 'EXPORTING' | 'EXPORTED';

interface StepperProps {
  currentStep: Step;
}

const steps: { title: Step; icon: React.ElementType; displayName: any }[] = [
  { title: 'AWAIT_TO_EXPORT', icon: Clock, displayName: 'Await to Export' },
  { title: 'EXPORTING', icon: ArrowDownCircle, displayName: 'Exporting' },
  { title: 'EXPORTED', icon: CheckCircle, displayName: 'Exported' }
];

export default function ImportStepper({ currentStep }: StepperProps) {
  console.log(currentStep);
  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.title === currentStep;
          const isPast = steps.findIndex((s) => s.title === currentStep) > index;

          return (
            <div key={step.title} className="flex flex-col items-center">
              <div className="relative">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isPast
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  )}>
                  <Icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute top-5 w-[80px] h-0.5  -right-24',
                      isPast ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-sm font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}>
                {step.displayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
