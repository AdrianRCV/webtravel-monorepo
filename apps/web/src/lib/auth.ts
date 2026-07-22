import { auth } from "@/auth";

export async function getSession() {
  return await auth();
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  return adminEmails.includes(email);
}

export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  
  if (!session.user.isAdmin) {
    throw new Error('Forbidden');
  }
  
  return session;
}
