import "./globals.css";
import Shell from "@/components/Shell";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";

export const metadata = {
  title: "Meridian ERP 6.0",
  description: "Enterprise Resource Planning",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-surface text-ink font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
