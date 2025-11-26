import { getUserFromSession } from "@/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getUserFromSession(req);
  console.log("USUARIO ")
  console.log(user)
  if (!user) {
    return NextResponse.json({ message: "Usuário não logado" }, { status: 401 });
  }
  return NextResponse.json(user);
}
