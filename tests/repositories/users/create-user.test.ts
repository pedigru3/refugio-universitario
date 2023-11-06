import { createUser } from '@/repositories/users/create-user'

describe('repositories: create user', () => {
  it('shold be return all users', async () => {
    const result = await createUser({
      name: 'Felipe',
      username: 'Pedigru',
    })
  })
})
