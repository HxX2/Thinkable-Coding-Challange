import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

async function getUser(email: string) {
  // return user from database with posts
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: {
      posts: true,
    },
  });

  return user;
}

export async function GET(request: Request) {
  const secret = process.env.NEXTAUTH_SECRET;
  const req = request as any;
  const token = await getToken({ req, secret });

  console.log("token", token);

  if (!token) {
    return NextResponse.json(
      { message: "User is not logged in." },
      { status: 404 }
    );
  } else {
    try {
      jwt.verify(token, secret);
      const user = await getUser(token.email || "");
      if (!user) {
        return NextResponse.json(
          { message: "User is not logged in." },
          { status: 404 }
        );
      }
      return NextResponse.json({ user }, { status: 200 });
    } catch (err) {
      console.log("err", err);
      return NextResponse.json(
        { message: "User is not logged in." },
        { status: 404 }
      );
    }
  }
  return NextResponse.json({ message: "User is logged in." });
}
