type UserProps = {
  name: string
  username: string
}

export async function createUser({ name, username }: UserProps) {
  const body = {
    name,
    username,
  }
  const result = await fetch(`${process.env.BASE_URL}/api/v1/users`, {
    method: 'post',
    body: JSON.stringify(body),
  })
}
