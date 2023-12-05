test('shold be return status', async () => {
  const response = await fetch(`${process.env.BASE_URL}/api/v1/status`)
  const data = await response.json()
  expect(data.updated_at).toBeDefined()

  new Date(data.updated_at).toDateString()
  const maxConnections = data.dependences.database.max_connections
  const openedConnections = data.dependences.database.opened_connections

  const maxConnectionsParsed = parseInt(maxConnections)
  expect(typeof maxConnectionsParsed).toBe('number')
  expect(openedConnections).toBeDefined()
})
