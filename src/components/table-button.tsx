'use client'

import { useEffect, useState } from 'react'

type TableButtonProps = {
  tableName: string
  chairCount: number
  emptyChairs: number
  isAvailable: boolean
  isChecked: boolean
  onSelectedTable: (isTableSelected: boolean) => void
}

export function TableButton({
  tableName,
  chairCount,
  emptyChairs,
  isAvailable,
  isChecked,
  onSelectedTable,
}: TableButtonProps) {
  const [placeState, setPlaceState] = useState({
    markedPlaces: chairCount - emptyChairs,
  })

  function handleSelectPlace() {
    if (isChecked) {
      console.log('check')
      onSelectedTable(false)
    } else {
      onSelectedTable(true)
    }
  }

  useEffect(() => {
    if (!isChecked) {
      setPlaceState({
        markedPlaces: chairCount - emptyChairs,
      })
    } else {
      setPlaceState({
        markedPlaces: chairCount - emptyChairs + 1,
      })
    }
  }, [chairCount, emptyChairs, isChecked])

  return (
    <button
      disabled={!isAvailable}
      className={` w-full rounded-md py-1 
      disabled:cursor-default disabled:opacity-40
      ${isChecked ? 'bg-blue-700' : 'bg-gray-600'}`}
      onClick={handleSelectPlace}
    >
      <p>{tableName}</p>
      <p>
        {placeState.markedPlaces}/{chairCount}
      </p>
    </button>
  )
}
