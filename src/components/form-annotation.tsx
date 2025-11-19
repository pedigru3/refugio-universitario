type FormAnnotationProps = {
  annotation: string | undefined
}

export function FormAnnotation({ annotation }: FormAnnotationProps) {
  if (annotation) {
    return <p className="text-yellow-200 mt-1">{annotation}</p>
  }
}
