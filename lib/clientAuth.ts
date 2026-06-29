import { SignJWT, jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-in-production'
)

export interface ClientPayload {
  id: number
  phone: string
  name: string
}

export async function signClientToken(payload: ClientPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)
}

export async function verifyClientToken(token: string): Promise<ClientPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      id: payload.id as number,
      phone: payload.phone as string,
      name: payload.name as string,
    }
  } catch {
    return null
  }
}

export async function getClientFromRequest(req: NextRequest): Promise<ClientPayload | null> {
  const token = req.cookies.get('client_token')?.value
  if (!token) return null
  return verifyClientToken(token)
}
