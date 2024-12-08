import { FC, useState, ReactNode } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { PurchasingStaffGuardDiv } from '@/components/authentication/createRoleGuard';

interface ExpandableSectionProps {
  title: string | null;
  children: ReactNode;
  status: ReactNode;
  redirectButton?: ReactNode;
  isExtra: boolean;
  defaultOpen?: boolean;
}

const ExpandableSectionCustom: FC<ExpandableSectionProps> = ({
  title,
  children,
  status,
  redirectButton,
  isExtra = false,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <div className="relative">
      {isExtra && (
        <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-0.5 text-xs font-bold">
          Extra
        </div>
      )}
      <Collapsible className="ring-1 ring-slate-300 " open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div
            className="flex items-center justify-between space-x-4 w-full  px-4 py-4 hover:bg-slate-100 border-b border-slate-200 cursor-pointer "
            onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center gap-2">
              <span className="text-lg text-slate-500 font-normal">Purchase Order Delivery: </span>
              <h1 className={`text-lg font-semibold text-primaryDark`}>
                {isExtra ? '-' : (title ?? '-')}
              </h1>
              <div className="ml-2">{status}</div>
            </div>
            <PurchasingStaffGuardDiv>
              <div className="flex gap-x-5">{redirectButton}</div>
            </PurchasingStaffGuardDiv>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent px-4 pb-5 ">
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ExpandableSectionCustom;
