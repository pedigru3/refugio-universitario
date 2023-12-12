describe('GET /users', () => {
  let response: Response
  let body: any

  beforeAll(async () => {
    response = await fetch(`${process.env.BASE_URL}/api/v1/users`)
    body = await response.json()
  })

  it('shold be return all users', () => {
    expect(body).toHaveProperty('users')
  })

  it('shold be return status 200', () => {
    expect(response.status).toEqual(200)
  })
})
