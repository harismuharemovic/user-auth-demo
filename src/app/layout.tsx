import type { Metadata } from 'next';
import { Poppins, Geist_Mono } from 'next/font/google';
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import { ReactPlugin } from '@stagewise-plugins/react';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UserAuth Demo - Secure Authentication System',
  description:
    'A modern authentication system built with Next.js, featuring secure user registration, login functionality, and protected dashboard access.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${geistMono.variable} antialiased`}>
        <StagewiseToolbar
          config={{
            plugins: [ReactPlugin],
          }}
        />
        {children}
      </body>
    </html>
  );
}
