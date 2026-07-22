import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "CLIENT" | "ADMIN";
      id?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "CLIENT" | "ADMIN";
    id?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: "CLIENT" | "ADMIN";
    userId?: string;
  }
}
