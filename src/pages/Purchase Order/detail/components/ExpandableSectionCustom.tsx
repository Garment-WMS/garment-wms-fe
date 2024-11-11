import { FC, useState, ReactNode } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  status: ReactNode;
  redirectButton?: ReactNode;
  defaultOpen?: boolean;
}

const ExpandableSectionCustom: FC<ExpandableSectionProps> = ({
  title,
  children,
  status,
  redirectButton,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <Collapsible className="ring-1 ring-slate-300 " open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div
          className="flex items-center justify-between space-x-4 w-full  px-4 py-3 hover:bg-slate-100 border-b border-slate-200 cursor-pointer "
          onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-2">
            <span className="text-lg text-slate-500 font-normal">Purchase Order Delivery: </span>
            <h1 className={`text-lg font-semibold text-primaryDark`}>{title}</h1>
          </div>
          <div className="flex gap-x-5">
            {' '}
            {status}
            {redirectButton}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent px-4 pb-5 ">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export default ExpandableSectionCustom;
