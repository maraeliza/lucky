import jwt from "jsonwebtoken";

export async function getUserFromSession(req: any) {
  const token = req.cookies.get("uaifoodtoken")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    return null;
  }
}
