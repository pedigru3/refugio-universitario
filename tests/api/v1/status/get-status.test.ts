test('shold be return status', async () => {
  const response = await fetch(`${process.env.BASE_URL}/api/v1/status`)

  const data = await response.json()

  const dataCompare = new Date(data.updated_at).toISOString()
  expect(data.updated_at).toEqual(dataCompare)

  const maxConnections = data.dependences.database.max_connections
  const maxConnectionsParsed = parseInt(maxConnections)
  expect(typeof maxConnectionsParsed).toBe('number')

  const openedConnections = data.dependences.database.opened_connections
  expect(openedConnections).toBeDefined()
  expect(data.dependences.database.version).toEqual('16.0')
})
