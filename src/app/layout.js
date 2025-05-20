// src/app/layout.js
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = { /* … */ };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}