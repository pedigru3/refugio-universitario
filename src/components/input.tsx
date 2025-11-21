/* eslint-disable prettier/prettier */
import { UseFormRegisterReturn } from 'react-hook-form'

type InputProps = {
  register: UseFormRegisterReturn
} & React.InputHTMLAttributes<HTMLInputElement>

export default function Input({ register, className, ...props }: InputProps) {
  return (
    <input
      className={`mt-4 h-12 w-full rounded-md pl-5 text-black outline-0 ${className || ''
        }`}
      {...register}
      {...props}
    />
  )
}
