'use client'

import { useState } from 'react'

export function TableIcon() {
  const linkClassOn = 'hover:opacity-80 cursor-pointer'
  const linkClassOff = 'opacity-40 cursor-pointer'
  const linkDisabled = 'opacity-30 pointer-events-none'

  const prelist: number[] = [1, 2]
  const [selected, setSelected] = useState<number[]>(prelist)

  function handleClick(n: number) {
    setSelected((value) => {
      if (value.includes(n)) {
        return prelist
      }
      return [...prelist, n]
    })
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      id="Camada_1"
      x={100}
      y={0}
      viewBox="400 100 566 568"
      className="w-96"
    >
      <style>{'.st0{fill:#565656}.st1{fill:#353535}.st2{fill:#353535}'}</style>
      <a
        onClick={() => handleClick(1)}
        className={
          prelist.includes(1)
            ? `${linkDisabled}`
            : selected.includes(1)
            ? `${linkClassOff}`
            : `${linkClassOn}`
        }
      >
        <path
          d="m607.6 524.7-75.8-87.2c-4.3-5-12-5.5-16.9-1.2l-70.6 61.4c-4.1 3.6-5.2 9.4-3 14.1l-1.1.9c-5 4.3-5.5 12-1.2 16.9l63.4 72.9c4.3 5 12 5.5 16.9 1.2l.8-.7c4.4 3.8 11.2 3.9 15.7 0l70.6-61.4c5-4.3 5.6-11.9 1.2-16.9z"
          className="st0"
        />
        <path
          d="m542.5 450.7 52.3 60.1c4.3 5 3.8 12.6-1.2 16.9l-55.2 48c-5 4.3-12.6 3.8-16.9-1.2l-52.3-60.1c-4.3-5-3.8-12.6 1.2-16.9l55.2-48c5-4.3 12.6-3.8 16.9 1.2z"
          className="st1"
        />
      </a>
      <a
        onClick={() => handleClick(2)}
        className={
          prelist.includes(2)
            ? `${linkDisabled}`
            : selected.includes(2)
            ? `${linkClassOff}`
            : `${linkClassOn}`
        }
      >
        {' '}
        <path
          d="m749.3 237 77.4 85.8c4.4 4.9 12 5.3 16.9.9l69.5-62.7c4-3.6 5-9.5 2.7-14.2l1.1-1c4.9-4.4 5.3-12 .9-16.9L853 157.1c-4.4-4.9-12-5.3-16.9-.9l-.8.7c-4.5-3.7-11.2-3.7-15.7.3L750.1 220c-4.9 4.4-5.3 12.1-.8 17z"
          className="st0"
        />
        <path
          d="m815.7 309.8-53.4-59.1c-4.4-4.9-4-12.5.9-16.9l54.3-49.1c4.9-4.4 12.5-4 16.9.9l53.4 59.1c4.4 4.9 4 12.5-.9 16.9l-54.3 49.1c-4.8 4.4-12.5 4-16.9-.9z"
          className="st1"
        />
      </a>
      <a
        onClick={() => handleClick(3)}
        className={
          prelist.includes(3)
            ? `${linkDisabled}`
            : selected.includes(3)
            ? `${linkClassOff}`
            : `${linkClassOn}`
        }
      >
        <path
          d="m825.6 452.7-85.3 77.9c-4.9 4.4-5.2 12.1-.8 17l63.1 69.1c3.7 4 9.5 5 14.2 2.7l1 1.1c4.4 4.9 12.1 5.2 17 .8L906 556c4.9-4.4 5.2-12.1.8-17l-.7-.8c3.7-4.5 3.6-11.2-.4-15.7l-63.1-69.1c-4.5-4.8-12.1-5.2-17-.7z"
          className="st0"
        />
        <path
          d="m753.2 519.5 58.8-53.7c4.9-4.4 12.5-4.1 17 .8l49.3 54.1c4.4 4.9 4.1 12.5-.8 17l-58.8 53.7c-4.9 4.4-12.5 4.1-17-.8l-49.3-54.1c-4.4-4.9-4.1-12.5.8-17z"
          className="st1"
        />
      </a>

      <a
        onClick={() => handleClick(4)}
        className={
          prelist.includes(4)
            ? `${linkDisabled}`
            : selected.includes(4)
            ? `${linkClassOff}`
            : `${linkClassOn}`
        }
      >
        <path
          d="m547.2 300.1 85.8-77.4c4.9-4.4 5.3-12 .9-16.9l-62.7-69.5c-3.6-4-9.5-5-14.2-2.7l-1-1.1c-4.4-4.9-12-5.3-16.9-.9l-71.7 64.7c-4.9 4.4-5.3 12-.9 16.9l.7.8c-3.7 4.5-3.7 11.2.3 15.7l62.7 69.5c4.5 4.9 12.1 5.3 17 .9z"
          className="st0"
        />
        <path
          d="M620.1 233.6 561 287c-4.9 4.4-12.5 4-16.9-.9L495 231.8c-4.4-4.9-4-12.5.9-16.9l59.1-53.4c4.9-4.4 12.5-4 16.9.9l49.1 54.3c4.3 4.9 4 12.5-.9 16.9z"
          className="st1"
        />
      </a>
      <circle cx={683} cy={378} r={187.5} className="st2" />
      <path d="M683 191c25.2 0 49.7 4.9 72.8 14.7 22.3 9.4 42.3 22.9 59.4 40.1 17.2 17.2 30.7 37.2 40.1 59.4 9.8 23.1 14.7 47.5 14.7 72.8s-4.9 49.7-14.7 72.8c-9.4 22.3-22.9 42.3-40.1 59.4-17.2 17.2-37.2 30.7-59.4 40.1-23.1 9.8-47.5 14.7-72.8 14.7s-49.7-4.9-72.8-14.7c-22.3-9.4-42.3-22.9-59.4-40.1-17.2-17.2-30.7-37.2-40.1-59.4-9.8-23.1-14.7-47.5-14.7-72.8s4.9-49.7 14.7-72.8c9.4-22.3 22.9-42.3 40.1-59.4 17.2-17.2 37.2-30.7 59.4-40.1 23.1-9.8 47.6-14.7 72.8-14.7m0-1c-103.8 0-188 84.2-188 188s84.2 188 188 188 188-84.2 188-188-84.2-188-188-188z" />
    </svg>
  )
}
