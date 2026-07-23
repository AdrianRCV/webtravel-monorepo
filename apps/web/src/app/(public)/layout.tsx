import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WebTravel",
  description: "Planifica tu próximo viaje con WebTravel",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
