import React from 'react'
import { Textarea } from "@/components/ui/Textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ReadOnlyTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  content: string
  maxHeight?: string
}

export function ReadOnlyTextArea({ 
  content, 
  maxHeight = "300px", 
  className,
  ...props 
}: ReadOnlyTextAreaProps) {
  return (
    <ScrollArea className={cn("w-full rounded-md border", className)} style={{ maxHeight }}>
      <Textarea
        value={content}
        readOnly
        className="min-h-[100px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
        {...props}
      />
    </ScrollArea>
  )
}

