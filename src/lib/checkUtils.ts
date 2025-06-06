import db from "./prismaClient"

export async function checkConnection() {
  try {
    await db.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await db.$disconnect()
  }
}
