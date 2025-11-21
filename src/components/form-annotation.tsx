import { ReactNode } from 'react'

type FormAnnotationProps = {
  annotation?: string
  children?: ReactNode
}

export function FormAnnotation({ annotation, children }: FormAnnotationProps) {
  if (annotation || children) {
    return <p className="text-yellow-200 mt-1">{annotation || children}</p>
  }
  return null
}
