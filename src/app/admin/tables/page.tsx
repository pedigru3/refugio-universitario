import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { TableForm } from '../components/table-form'

export default function Tables() {
  return (
    <div className="mt-10">
      <Container>
        <Title type="h2" color="light">
          Gerenciar Mesas
        </Title>
        <TableForm />
      </Container>
    </div>
  )
}
