import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow',
        outline: 'text-foreground',
        primary: 'border-transparent bg-bluePrimary text-white shadow  ',
        success: 'border-transparent bg-green-500 text-white shadow  ',
        warning: 'border-transparent bg-yellow-500 text-white shadow  ',
        danger: 'border-transparent bg-red-600 text-white shadow  ',
        info: 'border-transparent bg-bluePrimary text-white shadow  ',
        light: 'border-transparent bg-gray-100 text-gray-800 shadow  ',
        dark: 'border-transparent bg-gray-800 text-gray-100 shadow  '
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
