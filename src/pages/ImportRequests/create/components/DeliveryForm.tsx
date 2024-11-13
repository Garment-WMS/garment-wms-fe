import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/Form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Calendar } from '@/components/ui/Calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';

import { useGetAllPurchaseOrder } from '@/hooks/useGetAllPurchaseOrder';
import { PODelivery, PODeliveryDetail, PurchaseOrder } from '@/types/PurchaseOrder';
import { Textarea } from '@/components/ui/textarea';

type Props = {};

const formSchema = z.object({
  purchaseOrder: z.string().min(1, 'Please select a purchaseOrder.'),
  purchaseOrderBatch: z.string().min(1, 'Please select a supplier batch.'),
  deliveryDate: z.date({
    required_error: 'A date of delivery is required.'
  }),
  description: z.string().optional()
});

interface DeliveryFormProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  data: any;
  selectedPO: PurchaseOrder | undefined;
  setSelectedPO: React.Dispatch<React.SetStateAction<PurchaseOrder | undefined>>;
  setSelectedPoDelivery: React.Dispatch<React.SetStateAction<PODelivery | undefined>>;
  setPoDeliverydetails: React.Dispatch<React.SetStateAction<PODeliveryDetail[]>>;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
  form,
  onSubmit,
  data,
  selectedPO,
  setSelectedPO,
  setSelectedPoDelivery,
  setPoDeliverydetails
}) => {
  const [open, setOpen] = useState(false);
  const [poDelivery, setPODelivery] = useState<PODelivery[]>([]);

  const handlePOSelection = (currentValue: any, field: any, item: PurchaseOrder) => {
    form.setValue('purchaseOrder', currentValue === field.value ? '' : currentValue);
    setSelectedPO(item);
    setPODelivery(item.poDelivery);
    setOpen(false);
  };

  return (
    <div className="pr-4 pb-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full grid grid-cols-2 gap-4 justify-center items-center">
          <FormField
            control={form.control}
            name="purchaseOrder"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm">Purchase Order:</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`justify-between w-full ${selectedPO ? `opacity-100` : 'opacity-50'}`}>
                        {selectedPO ? selectedPO.poNumber : `Select Purchase Order`}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search PO..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No Purchase Order found.</CommandEmpty>
                          <CommandGroup>
                            {data?.map((item: any) => (
                              <CommandItem
                                key={item.id}
                                value={item.poNumber}
                                onSelect={(currentValue) =>
                                  handlePOSelection(currentValue, field, item)
                                }>
                                {item.poNumber}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    selectedPO?.poNumber === item.poNumber
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <FormLabel>Date of delivery</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          ' pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchaseOrderBatch"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm">Purchase Order batch</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    value={field.value || ''}
                    onValueChange={(value) => {
                      // Find the selected delivery batch by ID
                      const selectedDelivery = poDelivery.find((delivery) => delivery.id === value);
                      if (selectedDelivery) {
                        // Set the form field value
                        field.onChange(value);
                        // Set the selected delivery batch
                        setSelectedPoDelivery(selectedDelivery);
                        setPoDeliverydetails(selectedDelivery.poDeliveryDetail);
                      }
                    }}
                    disabled={poDelivery.length <= 0}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`${poDelivery.length > 0 ? `Choose a delivery Batch` : `Please choose Purchase order first`}`}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {poDelivery.map((delivery, index) => (
                        <SelectItem key={delivery.id} value={delivery.id}>
                          {`Delivery Batch #${index} - ${format(new Date(delivery.expectedDeliverDate), 'MM/dd/yyyy')}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm">Description</FormLabel>
                <FormControl>
                  <Textarea value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default DeliveryForm;
