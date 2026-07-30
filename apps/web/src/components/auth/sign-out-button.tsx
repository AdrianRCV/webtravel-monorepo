"use client";

import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { clearChatStorage } from "@/lib/chat-storage";

interface SignOutButtonProps {
  variant?: "dropdown" | "full";
}

export function SignOutButton({ variant = "dropdown" }: SignOutButtonProps) {
  const t = useTranslations("Auth.SignOut");
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      clearChatStorage();
      await signOut({ callbackUrl: getPathname({ href: "/login", locale }) });
    } catch (error) {
      console.error("Error signing out:", error);
      setIsLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 border border-destructive bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t("signingOut")}</span>
          </>
        ) : (
          <>
            <LogOut className="h-4 w-4" />
            <span>{t("signOut")}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="flex w-full items-center gap-2 px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{t("signingOut")}</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span>{t("signOut")}</span>
        </>
      )}
    </button>
  );
}
