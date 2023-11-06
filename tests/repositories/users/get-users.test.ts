import { getUsers } from '@/repositories/users/get-users'

describe('repositories: get users', () => {
  it('shold be return all users', async () => {
    const result = await getUsers()
    expect(result).toHaveLength(1)
  })
})
