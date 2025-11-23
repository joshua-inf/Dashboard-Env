import jwt, { SignOptions } from 'jsonwebtoken';



export type ApiDatatype = {
  id: string;
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string; // ISO date string
  iat: number; // issued at (UNIX timestamp)
  exp: number; // expiration (UNIX timestamp)
}


const JWT_SECRET: string = 'your_default_secret';


export function generateToken(
  payload: object,
  expiresIn: any = '1h' // ✅ number (seconds) or string like "1h"
): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
}

export const decodeToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

export function verifyToken(token: any) {
  try {
    return jwt.verify(token, JWT_SECRET);  // returns decoded payload if valid
  } catch (err) {
    console.error('Invalid token:', err);
    return null; // or you can re-throw the error depending on your error handling approach
  }
}

export const getUserDataWithToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      resolve(decoded);
    } catch (error) {
      console.error("Token verification failed:", error);
      reject(null);
    }
  });
};
