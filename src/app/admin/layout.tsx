import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de pedidos",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-lavender-50/60">{children}</div>;
}
