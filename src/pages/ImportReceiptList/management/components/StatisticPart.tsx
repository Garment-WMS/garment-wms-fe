import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import { badgeVariants } from '@/components/ui/Badge';
type Props = {
  title: string;
  content: string;
  isMoneyCurrency: boolean;
};

const StatisticPart: React.FC<Props> = (props) => {
  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-primary">{props.title}</CardTitle>
        <Link to={'/'}  className={badgeVariants({ variant: 'primary' })}>
          View
        </Link>
      </CardHeader>
      <CardContent className="mt-6">
        {props.isMoneyCurrency ? (
          <div className="text-4xl font-primary">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(199999)}
          </div>
        ) : (
          <div className="text-4xl font-primary">{props.content}</div>
        )}

        <p className="text-xs text-muted-foreground">The Total Revenue of</p>
      </CardContent>
    </Card>
  );
};

export default StatisticPart;
