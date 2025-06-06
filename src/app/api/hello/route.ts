import { checkConnection } from "@/lib/checkUtils"

export async function GET(request: Request) {
  await checkConnection()
  return new Response('Hello, Welcome to Dparkr!')
}
