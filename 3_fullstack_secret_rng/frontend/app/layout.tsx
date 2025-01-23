import "./globals.css";
import { Inter } from "next/font/google";
import { WalletProvider } from "../context/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fullstack Secret RNG",
  description: "A demo app with Secret Network integration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
