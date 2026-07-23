import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const isServer = typeof window === 'undefined';
          const apiUrl = isServer 
            ? (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
            : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');
          
          const response = await fetch(`${apiUrl}/auth/validate-credentials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) return null;
          const result = await response.json();
          
          if (!result.valid || !result.user) return null;
          if (result.user.role !== 'ADMIN') return null;

          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            image: result.user.image,
            accessToken: result.accessToken,
          };
        } catch (error) {
          console.error('Error validating credentials:', error);
          return null;
        }
      }
    })
  ],
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        return true;
      }
      
      return true;
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role || (account?.provider === "google" ? "CLIENT" : undefined);
        token.accessToken = user.accessToken;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as "CLIENT" | "ADMIN";
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  },
  
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
});
