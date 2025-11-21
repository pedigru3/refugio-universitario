'use client'

import { useEffect, useRef, useState } from 'react'

type Option = {
  value: string
  label: string
}

type CustomSelectProps = {
  options: Option[]
  placeholder: string
  value?: string
  onChange?: (value: string) => void
  error?: string
}

export function CustomSelect({
  options,
  placeholder,
  value,
  onChange,
  error,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const customSelectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  function handleToggleOpen() {
    setIsOpen((prev) => !prev)
  }

  function handleOptionClick(optionValue: string) {
    if (onChange) {
      onChange(optionValue)
    }
    setIsOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        customSelectRef.current &&
        !customSelectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="w-full mt-4 relative" ref={customSelectRef}>
      <div
        className={`h-12 ${
          !selectedOption ? 'text-zinc-400' : 'text-black'
        } flex pl-5 items-center rounded-md w-full bg-white cursor-pointer border ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        onClick={handleToggleOpen}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <ul className="absolute z-10 text-zinc-600 w-full overflow-auto max-h-52 bg-white border border-gray-300 rounded-md mt-1">
          {options.map((option) => (
            <li
              className="py-3 px-5 hover:bg-purple-100 cursor-pointer"
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
