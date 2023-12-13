'use client'

import { Button } from '@/components/button'
import { CheckBox } from '@/components/checkbox'
import { DialogComponent } from '@/components/dialog'
import { FormAnnotation } from '@/components/form-annotation'
import { IntervalDay } from '@/components/intervals/interval-day'
import { IntervalInputs } from '@/components/intervals/interval-inputs'
import { IntervalItem } from '@/components/intervals/interval-item'
import { IntervalSet } from '@/components/intervals/interval-set'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { getWeekDays } from '@/utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useState } from 'react'

import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O horário de término deve ser pelo menos 1h distante do início.',
      },
    ),
  lastDay: z
    .string({ required_error: 'Preencha o último dia de funcionamento' })
    .refine(
      (date) => dayjs(date).isAfter(dayjs(new Date()).hour(23).minute(59)),
      {
        message: 'A data deve ser posterior ao dia de hoje.',
      },
    ),
  startDay: z.string().optional(),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export function IntervalForm() {
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<
    TimeIntervalsFormInput,
    TimeIntervalsFormOutput,
    TimeIntervalsFormOutput
  >({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '9:00', endTime: '17:00' },
        { weekDay: 1, enabled: true, startTime: '9:00', endTime: '17:00' },
        { weekDay: 2, enabled: true, startTime: '9:00', endTime: '17:00' },
        { weekDay: 3, enabled: true, startTime: '9:00', endTime: '17:00' },
        { weekDay: 4, enabled: true, startTime: '9:00', endTime: '17:00' },
        { weekDay: 5, enabled: true, startTime: '9:00', endTime: '17:00' },
        { weekDay: 6, enabled: false, startTime: '9:00', endTime: '17:00' },
      ],
      startDay: dayjs(new Date()).format('YYYY-MM-DD'),
    },
  })

  const { fields } = useFieldArray({
    name: 'intervals',
    control,
  })

  const intervals = watch('intervals')

  const weekDays = getWeekDays()

  async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
    const { intervals, lastDay, startDay } = data as TimeIntervalsFormOutput

    const body = JSON.stringify({ intervals, lastDay, startDay })

    const response = await fetch('/api/v1/availability', {
      method: 'POST',
      body,
    })

    if (response.ok) {
      setIsAlertOpen(true)
    }
  }

  return (
    <div className="mt-10 max-w-[600px]">
      <h1 className="mb-10">Bem-vindo de volta!</h1>
      <form
        onSubmit={handleSubmit(handleSetTimeIntervals)}
        className="mt-6 flex flex-col"
      >
        <div className="border border-gray-400 rounded-md mb-2 ">
          {fields.map((field, index) => (
            <IntervalItem key={field.id}>
              <IntervalDay>
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <CheckBox
                      defaultChecked={value}
                      onCheckedChange={onChange}
                      label={weekDays[field.weekDay]}
                    />
                  )}
                />
              </IntervalDay>
              <IntervalInputs>
                <IntervalSet
                  disabled={intervals[index].enabled === false}
                  innerRef={register(`intervals.${index}.startTime`)}
                />
                <IntervalSet
                  disabled={intervals[index].enabled === false}
                  innerRef={register(`intervals.${index}.endTime`)}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </div>
        {errors.intervals && (
          <FormAnnotation annotation={errors.intervals.root?.message} />
        )}
        <div className="border border-gray-400 rounded-md mt-4">
          <IntervalItem>
            <div className="w-full flex justify-between items-center">
              <p className="text-sm md:text-base">
                Primeiro dia de funcionamento:
              </p>
              <input
                className=" block text-black min-w-[158px] rounded-lg px-2 py-1"
                type="date"
                {...register('startDay')}
              />
            </div>
          </IntervalItem>
          <IntervalItem>
            <div className="w-full flex justify-between items-center">
              <p className="text-sm md:text-base">
                Último dia de funcionamento:
              </p>
              <input
                className=" block text-black min-w-[158px] rounded-lg px-2 py-1"
                type="date"
                {...register('lastDay')}
              />
            </div>
          </IntervalItem>
        </div>
        {errors.lastDay && (
          <FormAnnotation annotation={errors.lastDay.message} />
        )}

        <Button isLoading={isSubmitting}>Concluir</Button>

        <DialogComponent
          isOpen={isAlertOpen}
          onOpenChange={(state) => console.log(state)}
          onClose={() => setIsAlertOpen(false)}
        />
      </form>
    </div>
  )
}
