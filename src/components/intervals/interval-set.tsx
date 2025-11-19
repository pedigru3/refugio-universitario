'use client'

import { ReactNode } from 'react'

export function IntervalSet({
  disabled,
  innerRef,
  background = false,
}: {
  children?: ReactNode
  innerRef?: any
  disabled?: boolean
  background?: boolean
}) {
  return (
    <div
      className={`${
        background ? 'bg-red-300' : 'bg-white'
      }  text-black rounded-lg shadow-xl 
                    py-1 px-2 ${disabled && 'opacity-50'}`}
    >
      <div className="flex">
        <select
          disabled={disabled}
          name="hours"
          className="disabled:opacity-50 bg-transparent text-lg appearance-none outline-none"
          {...innerRef}
        >
          {Array.from({ length: 24 }).map((_, index) => (
            <option key={index} value={`${index}:00`}>
              {index.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <span className={`text-xl mx-1 ${disabled && 'opacity-50'}`}>:</span>
        <select
          disabled={disabled}
          name="minutes"
          className="disabled:opacity-50 bg-transparent text-lg appearance-none outline-none"
        >
          <option value="0">00</option>
        </select>
      </div>
    </div>
  )
}
