import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

async function getUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  return user;
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        let user = null;

        // logic to verify if user exists
        user = await getUser(credentials?.email as string);

        if (!user) {
          throw new Error("Invalid email address.");
        }

        const passwordCorrect = compare(
          credentials?.password || "",
          user.password
        );

        if (!passwordCorrect) {
          throw new Error("Invalid password.");
        }

        // return user object with the their profile data
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
