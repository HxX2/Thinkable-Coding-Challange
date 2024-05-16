import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const secret = process.env.NEXTAUTH_SECRET;
  const req = request as any;
  const token = await getToken({ req, secret });

  console.log("token", token);

  if (!token) {
    return NextResponse.redirect("http://localhost:3000/login");
  } else {
    try {
      jwt.verify(token, secret);
    } catch (err) {
      console.log("err", err);
      return NextResponse.redirect("http://localhost:3000/login");
    }
  }
  return NextResponse.json({ message: "User is logged in." });
}
