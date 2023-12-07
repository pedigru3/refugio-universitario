import { useState } from 'react'

type CheckBoxProps = {
  label: string
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function CheckBox({
  label,
  defaultChecked,
  onCheckedChange,
}: CheckBoxProps) {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked ?? false)

  function handleCheckChange() {
    setIsChecked(!isChecked)
    onCheckedChange && onCheckedChange(!isChecked)
  }

  return (
    <div className="flex items-center">
      <input
        id={`${label}-checkbox`}
        type="checkbox"
        value=""
        onChange={handleCheckChange}
        checked={isChecked}
        className="w-5 h-5 text-blue-600 bg-gray-100
     border-gray-300 rounded focus:ring-blue-500
     dark:focus:ring-blue-600 dark:ring-offset-gray-800
    focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label
        htmlFor={`${label}-checkbox`}
        className="ms-4 text:sm lg:text-lg font-medium text-white dark:text-gray-300"
      >
        {label}
      </label>
    </div>
  )
}
