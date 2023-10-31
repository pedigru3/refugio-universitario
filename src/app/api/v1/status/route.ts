export async function GET() {
  const data = { teste: "teste" };
  return Response.json({ data }, { status: 200 });
}
