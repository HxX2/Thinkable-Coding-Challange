import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3).max(20),
});

async function getUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  return user;
}

const handler = async (req: NextRequest) => {
  if (req.method === "POST") {
    try {
      // logic to register user
      const data = await req.json();
      const { email, password, name } = registerSchema.parse(data);

      // check if user exists
      const user = await getUser(email);

      if (user) {
        return NextResponse.json(
          { error: "User Already exist" },
          { status: 400 }
        );
      }

      //hash password
      const hashedPassword = await hash(password, 10);

      // save user to database
      const userCreated = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          name: name,
        },
      });

      console.log(userCreated);
      // return success message
      return NextResponse.json(
        { message: "User registered." },
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { error: "Failed to register User" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
};

export { handler as POST };
