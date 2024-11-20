import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/Drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/DropdownMenu';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';

type BreadcrumbItemType = {
  href?: string;
  label: string;
  disabled?: boolean;
};

type BreadcrumbResponsiveProps = {
  breadcrumbItems: BreadcrumbItemType[];
  itemsToDisplay?: number;
};

export function BreadcrumbResponsive({
  breadcrumbItems,
  itemsToDisplay = 3
}: BreadcrumbResponsiveProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <Breadcrumb className="w-full py-2">
      <BreadcrumbList>
        {breadcrumbItems.length > 0 && (
          <>
            {/* Render first item */}
            <BreadcrumbItem>
              <BreadcrumbLink href={breadcrumbItems[0].href}>
                {breadcrumbItems[0].label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {breadcrumbItems.length > itemsToDisplay ? (
          <>
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger className="flex items-center gap-1" aria-label="Toggle menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {breadcrumbItems.slice(1, -itemsToDisplay + 1).map((item, index) => (
                      <DropdownMenuItem key={index}>
                        <Link to={item.href ? item.href : '#'}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>Navigate to</DrawerTitle>
                      <DrawerDescription>Select a page to navigate to.</DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {breadcrumbItems.slice(1, -itemsToDisplay + 1).map((item, index) => (
                        <Link key={index} to={item.href ? item.href : '#'} className="py-1 text-sm">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : null}

        {/* Render the last few items */}
        {/* {breadcrumbItems.slice(-itemsToDisplay + 1).map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.disabled ? (
              <BreadcrumbPage className="max-w-20 truncate md:max-w-none text-gray-500 cursor-default">
                {item.label}
              </BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild className="max-w-20 truncate md:max-w-none">
                  <Link to={item.href ?? '#'}>{item.label}</Link>
                </BreadcrumbLink>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </>
            )}
          </BreadcrumbItem>
        ))} */}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
