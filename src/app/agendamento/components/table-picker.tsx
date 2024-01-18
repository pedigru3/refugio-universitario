import { Button } from '@/components/button'
import { TableButton } from '@/components/table-button'
import { AvailabilityTables } from '../page'
import dayjs from 'dayjs'

interface TablePickerProps {
  currentHour: number | undefined
  availabilityTables: AvailabilityTables[]
  tableId: string
  isSending: boolean
  name: string | undefined
  selectedDate: Date | null
  handleSendingForm: () => void
  handleSelectTable: (isTableSelected: boolean, tableId: string) => void
}

export function TablePickerComponent({
  currentHour,
  availabilityTables,
  tableId,
  isSending,
  name,
  selectedDate,
  handleSelectTable,
  handleSendingForm,
}: TablePickerProps) {
  return (
    <div className="bg-zinc-800 border-t border-zinc-400 rounded-md rounded-t-none box-border max-w-[540px] lg:max-w-[800px]">
      <div className="mx-5 pt-5 pb-5">
        Reserve sua mesa das{' '}
        <span className="font-bold">{currentHour} horas:</span>
        <div className="flex gap-2 mt-2 mb-2">
          {availabilityTables.map((table) => {
            return (
              <TableButton
                key={table.table_id + table.chair_count + table.empty_chairs}
                chairCount={table.chair_count}
                emptyChairs={table.empty_chairs}
                isAvailable={table.isAvailable}
                tableName={table.table_name}
                isChecked={tableId === table.table_id}
                onSelectedTable={(isTableSelected) =>
                  handleSelectTable(isTableSelected, table.table_id)
                }
              />
            )
          })}
        </div>
      </div>
      {tableId.length > 0 && (
        <div className="px-6 pb-6 w-full border-t">
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-5">
            <div className="items-center self-center">
              <p>{name}, confirme sua reserva:</p>
              <p>Data: {dayjs(selectedDate).format('dddd, DD/MM/YYYY')}</p>
              <p>Horário: {currentHour} horas</p>
            </div>
            <div className="-mt-5">
              <Button
                isLoading={isSending}
                onClick={handleSendingForm}
                bgColor={'gray'}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
