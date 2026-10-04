import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const TAG_LENGTH = 16

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY
  if (!secret) {
    throw new Error("ENCRYPTION_KEY environment variable is required. Generate with: openssl rand -base64 32")
  }
  if (secret.length < 32) {
    throw new Error("ENCRYPTION_KEY must be at least 32 characters")
  }
  return crypto.createHash("sha256").update(secret).digest()
}

export function encrypt(text: string): string {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  
  const tag = cipher.getAuthTag()
  
  // Combine iv + encrypted + tag
  return iv.toString("hex") + ":" + encrypted + ":" + tag.toString("hex")
}

export function decrypt(encryptedData: string): string {
  const key = getEncryptionKey()
  const parts = encryptedData.split(":")
  
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format")
  }
  
  const iv = Buffer.from(parts[0], "hex")
  const encrypted = parts[1]
  const tag = Buffer.from(parts[2], "hex")
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  
  return decrypted
}