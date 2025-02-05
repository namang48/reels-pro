import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "abc@mail.com" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Missing Email or password !!");
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user Found !!");
          }

          const isValid = await bcrypt.compare(
            user.password,
            credentials.password
          );

          if (!isValid) {
            throw new Error("Inavalid Password !!");
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks : {
    async jwt({token,user}){{
      if(user){
        token.id=user.id
      }
      return token
    }},
    async session({session,token}){
      if(session.user){
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages:{
    signIn : "/login",
    error : "/login",
  },
  session : {
    strategy : "jwt",
    maxAge : 30*24*60*60,
  },
  secret : process.env.NEXTAUTH_SECRET
};
