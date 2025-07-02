'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn, formatDateTime } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { PopoverClose } from '@radix-ui/react-popover'

export function CalendarDateRangePicker({
  defaultDate,
  setDate,
  className,
}: {
  defaultDate?: DateRange
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  className?: string
}) {
  const [calendarDate, setCalendarDate] = React.useState<DateRange | undefined>(
    defaultDate
  )

  return (
    <div
      className={cn(
        'grid gap-2 font-sans',
        'bg-gradient-to-r from-[#0a0a12] via-[#121224] to-[#0a0a12]',
        'rounded-xl p-5 shadow-[0_0_15px_#00e0ff80]',
        className
      )}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[300px] justify-start text-left font-semibold tracking-wide',
              'text-cyan-400 hover:text-cyan-200',
              'bg-[#121224] border border-cyan-600 hover:border-cyan-400',
              'rounded-lg shadow-[0_0_20px_#00dfff80]',
              'transition duration-300 ease-in-out',
              'h-12 px-4 py-3',
              !calendarDate && 'text-cyan-600',
              'flex items-center gap-3'
            )}
          >
            <CalendarIcon className="h-5 w-5 text-cyan-400" />
            {calendarDate?.from ? (
              calendarDate.to ? (
                <>
                  <span className="text-cyan-300">
                    {formatDateTime(calendarDate.from).dateOnly}
                  </span>
                  <span className="text-cyan-500 mx-1">-</span>
                  <span className="text-cyan-300">
                    {formatDateTime(calendarDate.to).dateOnly}
                  </span>
                </>
              ) : (
                <span className="text-cyan-300">
                  {formatDateTime(calendarDate.from).dateOnly}
                </span>
              )
            ) : (
              <span className="text-cyan-600 italic">Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            'w-auto p-0 bg-[#121224] border border-cyan-600 rounded-lg shadow-lg',
            'shadow-[0_0_25px_#00e0ffbb]'
          )}
          align="end"
        >
          <div className="flex gap-4 px-4 py-6 bg-[#0a0a12] rounded-t-lg">
            <Calendar
              mode="range"
              defaultMonth={defaultDate?.from}
              selected={calendarDate}
              onSelect={setCalendarDate}
              numberOfMonths={1}
              className="bg-[#121224] rounded-lg shadow-[0_0_10px_#00cfffaa] text-cyan-300"
              fixedWeeks
              showOutsideDays
              modifiersClassNames={{
                selected: 'bg-cyan-500 text-white rounded',
                range_start: 'bg-cyan-600 text-white rounded-l-md',
                range_end: 'bg-cyan-600 text-white rounded-r-md',
                range_middle: 'bg-cyan-400 text-white',
                today: 'ring-2 ring-cyan-400',
                disabled: 'opacity-30 cursor-not-allowed',
              }}
            />
            <Calendar
              mode="range"
              defaultMonth={
                calendarDate?.from
                  ? new Date(
                      calendarDate.from.getFullYear(),
                      calendarDate.from.getMonth() + 1,
                      1
                    )
                  : undefined
              }
              selected={calendarDate}
              onSelect={setCalendarDate}
              numberOfMonths={1}
              className="bg-[#121224] rounded-lg shadow-[0_0_10px_#00cfffaa] text-cyan-300"
              fixedWeeks
              showOutsideDays
              modifiersClassNames={{
                selected: 'bg-cyan-500 text-white rounded',
                range_start: 'bg-cyan-600 text-white rounded-l-md',
                range_end: 'bg-cyan-600 text-white rounded-r-md',
                range_middle: 'bg-cyan-400 text-white',
                today: 'ring-2 ring-cyan-400',
                disabled: 'opacity-30 cursor-not-allowed',
              }}
            />
          </div>
          
          <div className="flex justify-between items-center p-4 bg-[#0a0a12] rounded-b-lg border-t border-cyan-600/50">
            <PopoverClose asChild>
              <Button
                variant="outline"
                className="border-cyan-600 text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-200"
              >
                Cancel
              </Button>
            </PopoverClose>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-cyan-400 hover:bg-cyan-900/30"
                onClick={() => setCalendarDate(undefined)}
              >
                Reset
              </Button>
              <PopoverClose asChild>
                <Button
                  onClick={() => setDate(calendarDate)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-[0_0_10px_#00e0ffcc]"
                >
                  Apply
                </Button>
              </PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}