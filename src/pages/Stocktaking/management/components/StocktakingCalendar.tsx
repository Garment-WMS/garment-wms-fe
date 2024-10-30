import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Maximize2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

type Event = {
  date: Date;
  title: string;
}

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function StocktakingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  }

  const addEvent = () => {
    if (selectedDate && newEventTitle) {
      setEvents([...events, { date: selectedDate, title: newEventTitle }]);
      setNewEventTitle('');
      setSelectedDate(null);
    }
  }

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate);
    const firstDayOfMonth = days[0].getDay();

    return (
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-sm py-2">{day}</div>
        ))}
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}
        {days.map((day, index) => {
          const dayEvents = events.filter(event => 
            event.date.toDateString() === day.toDateString()
          );
          return (
            <div 
              key={index} 
              className={`p-2 border rounded-md ${day.toDateString() === new Date().toDateString() ? 'bg-blue-500 text-white' : ''}`}
            >
              <div className="font-semibold">{day.getDate()}</div>
              {dayEvents.map((event, eventIndex) => (
                <div key={eventIndex} className="text-xs bg-green-500 p-1 mt-1 rounded">
                  {event.title}
                </div>
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-1 p-0 h-6" 
                    onClick={() => setSelectedDate(day)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Stocktaking Event</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="event-date"
                        value={selectedDate ? selectedDate.toDateString() : ''}
                        className="col-span-3"
                        readOnly
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="event-title"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={addEvent}>Add Event</Button>
                </DialogContent>
              </Dialog>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-8xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-2xl font-bold">Schedule</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderCalendar()}
      </CardContent>
    </Card>
  )
}