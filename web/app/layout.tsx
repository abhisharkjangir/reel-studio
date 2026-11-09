import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reel Studio",
  description: "Type a topic, get a finished Instagram reel.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <nav className="border-b border-[color:var(--border)] px-6 py-3 flex items-center gap-6 sticky top-0 z-10 bg-[color:var(--background)]/90 backdrop-blur">
          <Link href="/" className="font-bold text-lg tracking-tight">reel·studio</Link>
          <div className="flex gap-1 text-sm">
            <NavLink href="/">Make a reel</NavLink>
            <NavLink href="/reels">Reels</NavLink>
            <NavLink href="/looks">Looks</NavLink>
          </div>
          <div className="ml-auto text-xs text-[color:var(--muted)]">personal · no login</div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8 w-full">{children}</main>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-3 py-1.5 rounded-md hover:bg-[color:var(--card)] transition">
      {children}
    </Link>
  );
}
