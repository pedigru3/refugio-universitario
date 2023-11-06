'use client'

import { useEffect, useRef, useState } from 'react'

type CustomSelectProps = {
  handleOptionClick: (value: string) => void
  textDefault: string
  options: string[]
  index?: number
}

export function CustomSelect({
  handleOptionClick,
  options,
  textDefault,
  index,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [option, setOption] = useState('')

  const zindex = `z-${index ?? 0}`

  const customSelectRef = useRef<HTMLDivElement>(null)

  function handleCustomSelectClick() {
    setIsOpen((value) => !value)
  }

  function handleClick(value: string) {
    handleOptionClick(value)
    setIsOpen((value) => !value)
    setOption(value)
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

    // Adicione o event listener quando o componente for montado
    document.addEventListener('mousedown', handleClickOutside)

    // Remova o event listener quando o componente for desmontado
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className=" w-full mt-4" ref={customSelectRef}>
      <div
        className={`h-12 ${
          option === '' ? 'text-zinc-400' : 'text-black'
        } flex pl-5 items-center rounded-md w-full bg-white cursor-pointer`}
        onClick={handleCustomSelectClick}
      >
        {option === '' ? textDefault : option}
      </div>
      {isOpen && (
        <ul
          className={`absolute ${zindex} text-zinc-400 w-full overflow-auto h-52 bg-purple-500 flex flex-col items-center rounded-md`}
        >
          {options.map((level) => (
            <li
              className={`bg-white py-3 items-center flex pl-5 border-b-2 w-full cursor-pointer`}
              key={level}
              onClick={() => handleClick(level)}
            >
              {level}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
