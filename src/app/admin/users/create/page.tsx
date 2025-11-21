import { Container } from '@/components/container'
import { Title } from '@/components/title'
import { CreateUserForm } from './create-user-form'

export default function CreateUserPage() {
  return (
    <div className="mt-10">
      <Container>
        <Title type="h2" color="light">
          Criar usuário
        </Title>
        <CreateUserForm />
      </Container>
    </div>
  )
}
