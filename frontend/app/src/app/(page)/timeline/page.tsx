'use client'
import React, { useEffect, useRef } from 'react'
import { addToast, Alert, Card, CardBody, Divider } from '@heroui/react'
import { getAllSprints } from '@api/actions/sprint'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isAfter,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import EventCards from './components/EventCards'
import { PlusIcon } from '@heroicons/react/20/solid'

const getWeekdaysOnly = (year: number, month: number): Date[][] => {
  // Adjust month for zero-based index, ensure the first day is a Monday
  const firstDayOfMonth = startOfMonth(new Date(year, month - 1))
  const lastDayOfMonth = endOfMonth(firstDayOfMonth)
  let current = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 })
  const result: Date[][] = []
  while (current <= lastDayOfMonth) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = addDays(current, i)
      if (day.getDay() >= 1 && day.getDay() <= 5) {
        week.push(day)
      }
    }
    result.push(week)
    current = addDays(current, 7)
  }
  return result
}

const Timeline = () => {
  const dispatch = useAppDispatch()
  const currentMonthRef = useRef<HTMLDivElement>(null)
  const toastShownRef = useRef(false)
  const allSprints = useAppSelector((state) => state.sprint?.sprints)
  const startDate = new Date(2025, 0) // Jan 2025
  const endDate = addMonths(new Date(), 12) // today + 1 year

  const months = []
  let current = startDate
  while (!isAfter(current, endDate)) {
    months.push(current)
    current = addMonths(current, 1)
  }

  useEffect(() => {
    dispatch(getAllSprints())
  }, [])

  useEffect(() => {
    if (currentMonthRef.current) {
      currentMonthRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])

  useEffect(() => {
    if (!toastShownRef.current) {
    addToast({
      title: (
        <p className="flex items-center justify-center">
          點擊右上方
          <PlusIcon className="bg-default w-5 h-5 mx-1 rounded-md" />
          按鈕來新增事件
        </p>
      ),
      timeout: 5000,
    })
      toastShownRef.current = true
    }
  }, [])

  return (
    <>
      <div className="flex pr-8 w-full h-[83vh]">
        <Card
          radius="sm"
          shadow="none"
          className="flex flex-col bg-primary w-full rounded-tl-3xl rounded-br-3xl p-4 gap-4 overflow-y-auto"
        >
          {months.map((date, monthIndex) => {
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const weeks = getWeekdaysOnly(year, month)
            const today = new Date()
            const isCurrentMonth =
              today.getFullYear() === year && today.getMonth() + 1 === month
            return (
              <div
                key={monthIndex}
                ref={isCurrentMonth ? currentMonthRef : undefined}
              >
                <p className="text-xl font-light px-2">
                  {format(date, 'yyyy/MM')}
                </p>
                <div className="flex flex-col gap-6 pb-2">
                  {weeks.map((week, weekIndex) => (
                    <Card
                      key={weekIndex}
                      className="flex items-center w-full h-44 bg-white shadow-[2px_4px_4px_0_rgba(0,0,0,0.25)]"
                    >
                      <CardBody className="flex-row items-start justify-between p-0">
                        {week.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className={`relative flex items-center justify-start w-full h-full ${
                              isSameMonth(day, date)
                                ? 'bg-white'
                                : 'bg-[#e6e6e6]'
                            }`}
                          >
                            <div className="flex flex-col items-center justify-start w-full h-full">
                              <div className="p-3">
                                <span className="">{format(day, 'EEE')}</span>
                                <span className="text-xs text-lightgray font-light px-1">
                                  {format(day, 'M/dd')}
                                </span>
                              </div>
                              {allSprints && (
                                <div className="flex flex-col items-center justify-center gap-2 text-sm font-light w-full p-2">
                                  <EventCards day={day} sprints={allSprints} />
                                </div>
                              )}
                            </div>
                            {!isSameMonth(day, date) && (
                              <div className="absolute inset-0 bg-[#e6e6e6] opacity-60" />
                            )}
                            {dayIndex !== week.length - 1 && (
                              <Divider
                                orientation="vertical"
                                className="bg-black/40 h-3/5 mt-12"
                              />
                            )}
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </Card>
      </div>
      {/* <Alert
        hideIcon
        description={
          <p>
            點擊右上方
            <PlusIcon />
            按鈕來新增事件
          </p>
        }
        variant="faded"
      /> */}
    </>
  )
}

export default Timeline
