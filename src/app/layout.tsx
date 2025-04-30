import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter for better readability
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { cn } from '@/lib/utils';
import { Geist, Geist_Mono } from 'next/font/google'; // Keeping Geist as requested
import { AIChatButton } from '@/components/AIChatButton'; // Import the new component

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'JS Ascent - Learn JavaScript Interactively',
  description: 'Master JavaScript from beginner to advanced with interactive tutorials, AI explanations, and a live code runner.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            {/* Optional Footer can be added here */}
            <AIChatButton /> {/* Add the AI Chat Button here */}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
