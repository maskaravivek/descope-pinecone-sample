export const metadata = {
  title: "Pinecone - Vercel AI SDK Example",
  description: "Pinecone - Vercel AI SDK Example",
};

import "../global.css";
import { AuthProvider } from '@descope/nextjs-sdk';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider projectId="P2jWckKUbwgC4qyurDSiKZwGa7Cq">
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
