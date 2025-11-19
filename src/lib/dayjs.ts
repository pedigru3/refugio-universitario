import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'

import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')
dayjs.extend(dayjsUtc)
