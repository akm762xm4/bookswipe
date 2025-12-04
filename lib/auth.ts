import crypto from "crypto";

const DEFAULT_SECRET = "dev-secret";
const getSecret = () => process.env.AUTH_SECRET || DEFAULT_SECRET;

export type SessionPayload = {
  sub: string;
  role: "USER" | "ADMIN";
  exp: number; // epoch seconds
};

export function signToken(payload: SessionPayload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "BSWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const data = `${header}.${body}`;
  const sig = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const data = `${header}.${body}`;
  const expected = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export async function scryptHash(password: string, salt?: string) {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, s, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
  return `scrypt:${s}:${derived.toString("hex")}`;
}

export async function scryptVerify(password: string, stored: string) {
  const [prefix, salt, hash] = stored.split(":");
  if (prefix !== "scrypt" || !salt || !hash) return false;
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), derived);
}