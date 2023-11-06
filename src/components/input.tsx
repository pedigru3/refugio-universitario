import { UseFormRegisterReturn } from 'react-hook-form'

type InputProps = {
  register: UseFormRegisterReturn
} & React.InputHTMLAttributes<HTMLInputElement>

export default function Input({ register, ...props }: InputProps) {
  return (
    <input
      className="mt-4 text-black pl-5 w-full h-12 rounded-md outline-0"
      {...register}
      {...props}
    />
  )
}
