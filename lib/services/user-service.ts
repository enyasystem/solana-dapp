import { executeQuery } from "../db"
import { v4 as uuidv4 } from "uuid"

export type User = {
  id: string
  email: string
  name?: string | null
  picture?: string | null
  createdAt: Date
  updatedAt: Date
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await executeQuery('SELECT * FROM "User" WHERE email = $1 LIMIT 1', [email])

  return result.length > 0 ? result[0] : null
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await executeQuery('SELECT * FROM "User" WHERE id = $1 LIMIT 1', [id])

  return result.length > 0 ? result[0] : null
}

export async function createUser(userData: {
  email: string
  name?: string
  picture?: string
}): Promise<User> {
  const id = uuidv4()
  const now = new Date()

  const result = await executeQuery(
    'INSERT INTO "User" (id, email, name, picture, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [id, userData.email, userData.name || null, userData.picture || null, now, now],
  )

  return result[0]
}

export async function updateUser(
  id: string,
  userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
): Promise<User | null> {
  const updates = Object.entries(userData)
    .filter(([_, value]) => value !== undefined)
    .map(([key, _], index) => `"${key}" = $${index + 2}`)

  if (updates.length === 0) return getUserById(id)

  const values = Object.entries(userData)
    .filter(([_, value]) => value !== undefined)
    .map(([_, value]) => value)

  const query = `
    UPDATE "User"
    SET ${updates.join(", ")}, "updatedAt" = NOW()
    WHERE id = $1
    RETURNING *
  `

  const result = await executeQuery(query, [id, ...values])
  return result.length > 0 ? result[0] : null
}
