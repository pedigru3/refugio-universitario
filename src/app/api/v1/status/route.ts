export async function GET(request: Request) {
  const data = { teste: "teste" };
  return Response.json({ data }, { status: 200 });
}
