import { TableButton } from '@/components/table-button'
import { ScheduleContext } from '@/context/schedule-provider'
import dayjs from 'dayjs'
import { useContext } from 'react'
import useSWR from 'swr'

interface AvailabilityTable {
  table_id: string
  table_name: string
  is_available: boolean
}

type AvailabilityTables = AvailabilityTable[]

export function TablePickerComponent() {
  const { selectedDate, tableCheckedId, clearAllData, changeTableId } =
    useContext(ScheduleContext)

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availabilityTables, isLoading: loadingTables } =
    useSWR<AvailabilityTables>(
      selectedDate ? ['availabilityTables', selectedDateWithoutTime] : null,
      async () => {
        const response = await fetch(
          `/api/v2/availability?date=${selectedDateWithoutTime}`,
        )
        const json = await response.json()
        return json.availability
      },
    )

  async function handleSelectTable(tableId: string) {
    clearAllData()
    changeTableId(tableId)
  }

  return (
    availabilityTables && (
      <div className="bg-zinc-800 mt-1 rounded-md p-4">
        <p className="text-lg text-bold">
          Escolha uma mesa para o dia {selectedDate?.getDate()}:
        </p>
        <p className="pt-2 pb-1">
          <span className="font-bold text-red-400">Atenção: </span>Você só está
          garantindo o seu lugar. Cada um deve fazer o seu próprio agendamento.
        </p>
        <div className="flex gap-3 mt-2">
          {loadingTables ? (
            <p>loading</p>
          ) : (
            availabilityTables.map((table) => {
              return (
                <TableButton
                  key={table.table_id}
                  chairCount={0}
                  emptyChairs={0}
                  isAvailable={table.is_available}
                  isChecked={table.table_id === tableCheckedId}
                  tableName={table.table_name}
                  onSelectedTable={() => {
                    handleSelectTable(table.table_id)
                  }}
                />
              )
            })
          )}
        </div>
      </div>
    )
  )
}
