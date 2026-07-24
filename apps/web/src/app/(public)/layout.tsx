import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YourAgencyToday",
  description: "Planifica tu próximo viaje con YourAgencyToday",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
