import { getUserFromSession } from "@/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getUserFromSession(req);
  console.log("USUARIO ");
  console.log(user);
  if (!user) {
    return NextResponse.json(
      { message: "Usuário não logado" },
      { status: 401 }
    );
  }
  return NextResponse.json(user);
}
export async function DELETE(req: NextRequest) {
  const user = await getUserFromSession(req);
  console.log("USUARIO", user);

  if (!user) {
    return NextResponse.json(
      { message: "Usuário não logado" },
      { status: 401 }
    );
  }

  // Criar resposta
  const res = NextResponse.json({ message: "Logout realizado com sucesso" });

  // Apagar o cookie
  res.cookies.set("uaifoodtoken", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0, // expira imediatamente
  });

  return res;
}
