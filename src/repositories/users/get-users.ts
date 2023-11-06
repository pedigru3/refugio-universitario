export async function getUsers() {
  const result2 = await fetch(`${process.env.BASE_URL}/api/v1/users`)
  if (result2.ok) {
    const body = await result2.json()
    return body.users
  }
}
