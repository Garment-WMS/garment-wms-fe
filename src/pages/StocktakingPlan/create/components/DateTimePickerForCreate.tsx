import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { format, isAfter } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import "react-datepicker/dist/react-datepicker.css"
import './custom-datepicker.css'

interface DateTimePickerProps {
  onDateTimeChange: (startDate: Date | null, endDate: Date | null) => void
}

export function DateTimePickerForCreate({ onDateTimeChange }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (startTime && endTime && !isAfter(endTime, startTime)) {
      setError("End time must be after start time")
      setEndTime(null)
    } else {
      setError(null)
    }
  }, [startTime, endTime])

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    setStartTime(null)
    setEndTime(null)
    setError(null)
  }
//   let newStartDate = new Date()    
  const handleStartTimeChange = (time: Date | null) => {
    setStartTime(time)
    setEndTime(null)
    setError(null)
    if (selectedDate && time) {
       const newStartDate = new Date(selectedDate)
      newStartDate.setHours(time.getHours(), time.getMinutes())
      onDateTimeChange(newStartDate, null)
    }
  }

  const handleEndTimeChange = (time: Date | null) => {
    if (startTime && time && isAfter(time, startTime)) {
      setEndTime(time)
      setError(null)
      if (selectedDate && startTime) {
        const newEndDate = new Date(selectedDate)
        newEndDate.setHours(time.getHours(), time.getMinutes())
        onDateTimeChange(null, newEndDate)
      }
    } else {
      setError("End time must be after start time")
      setEndTime(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="date-picker">Select Date</Label>
        <div className="relative">
          <DatePicker
            id="date-picker"
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholderText="Select a date"
          />
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
        </div>
      </div>

      {selectedDate && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <div className="relative">
              <DatePicker
                id="start-time"
                selected={startTime}
                onChange={handleStartTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                minTime={new Date(selectedDate.setHours(9, 0, 0))}
                maxTime={new Date(selectedDate.setHours(18, 0, 0))}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholderText="Select start time"
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
            </div>
          </div>

          <div>
            <Label htmlFor="end-time">End Time</Label>
            <div className="relative">
              <DatePicker
                id="end-time"
                selected={endTime}
                onChange={handleEndTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholderText="Select end time"
                disabled={!startTime}
                minTime={startTime || undefined}
                maxTime={new Date(selectedDate.setHours(18, 0, 0))}
              />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={15} />
            </div>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className='w-1/2'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedDate && startTime && endTime && !error && (
        <div className="bg-gray-100 p-4 rounded-md w-1/2">
          <p className="text-sm font-medium">Selected Date and Time:</p>
          <p className="text-sm">{format(selectedDate, 'MMMM d, yyyy')}</p>
          <p className="text-sm">
            {format(startTime, 'h:mm aa')} - {format(endTime, 'h:mm aa')}
          </p>
        </div>
      )}
    </div>
  )
}

