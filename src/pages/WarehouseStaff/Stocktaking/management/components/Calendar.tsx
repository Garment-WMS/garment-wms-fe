import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Event = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  color: string
}

type CalendarProps = {
  initialMonth: number
  initialYear: number
  events: Event[]
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar({ initialMonth, initialYear, events }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth)
  const [currentYear, setCurrentYear] = useState(initialYear)

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - startingDayOfWeek + 1
    return day > 0 && day <= daysInMonth ? day : null
  })

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      return (
        eventStart.getFullYear() === currentYear &&
        eventStart.getMonth() === currentMonth &&
        day >= eventStart.getDate() &&
        day <= eventEnd.getDate()
      )
    })
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center space-x-4">
          <Button onClick={goToPreviousMonth} variant="outline" size="icon" aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-lg font-semibold">
            {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
          <Button onClick={goToNextMonth} variant="outline" size="icon" aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 relative">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center font-semibold p-2">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          const dayEvents = day ? getEventsForDay(day) : []
          return (
            <div
              key={index}
              className={cn(
                "border p-2 h-24 relative z-0 opacity-45",
                day ? "bg-white " : "bg-gray-100"
              )}
            >
              {day && (
                <>
                  <span className={cn(
                    "absolute top-1 left-1",
                    day === 1 ? "font-bold" : "text-gray-600"
                  )}>
                    {day}
                  </span>
                  <div className="mt-6 space-y-1">
                    {dayEvents.map((event, eventIndex) => {
                      const isStart = event.startDate.getDate() === day
                      const isEnd = event.endDate.getDate() === day
                      const eventLength = Math.min(
                        event.endDate.getDate() - day + 1,
                        7 - (index % 7)
                      )
                      return (
                        <div
                          key={`${event.id}-${eventIndex}`}
                          className={cn(
                            "text-xs p-1 overflow-hidden absolute  text-ellipsis whitespace-nowrap text-white z-10",
                            event.color,
                            isStart && "rounded-l-md",
                            isEnd && "rounded-r-md"
                          )}
                          style={{
                            width: `${eventLength * 95}%`,
                            marginLeft: isStart ? '0' : '-100%',
                          }}
                        >
                          {isStart && event.name}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}