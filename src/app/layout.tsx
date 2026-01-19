import type { Metadata } from "next";
import { getTheme } from "@/lib/utils/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "RBAC Admin Panel",
  description: "Production-quality RBAC Admin Panel with Support Ticket System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme-preference') || 'light';
                  if (theme === 'dark' || (!localStorage.getItem('theme-preference') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
