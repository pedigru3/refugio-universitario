import { Container } from '@/components/container'
import { TableForm } from '../table-form'
import { Title } from '@/components/title'

export default function Tables() {
  return (
    <div className="mt-10">
      <Container>
        <Title type="h2" color="light">
          Gerenciar Mesas
        </Title>
        <TableForm></TableForm>
      </Container>
    </div>
  )
}
