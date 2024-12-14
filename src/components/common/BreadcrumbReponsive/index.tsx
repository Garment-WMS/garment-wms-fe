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
        {/* Render all items if itemsToDisplay is larger or equal to breadcrumbItems length */}
        {breadcrumbItems.length <= itemsToDisplay ? (
          breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.disabled ? (
                  <BreadcrumbPage className="max-w-20 truncate md:max-w-none text-gray-500 cursor-default">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href ?? '#'}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))
        ) : (
          <>
            {/* Render first item */}
            <BreadcrumbItem>
              <BreadcrumbLink href={breadcrumbItems[0].href}>
                {breadcrumbItems[0].label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Render ellipsis and intermediate items in dropdown/drawer */}
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger className="flex items-center gap-1" aria-label="Toggle menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {breadcrumbItems.slice(1, -1).map((item, index) => (
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
                      {breadcrumbItems.slice(1, -1).map((item, index) => (
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

            {/* Render last item */}
            <BreadcrumbItem>
              <BreadcrumbLink href={breadcrumbItems[breadcrumbItems.length - 1].href}>
                {breadcrumbItems[breadcrumbItems.length - 1].label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
