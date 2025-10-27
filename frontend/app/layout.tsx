export const metadata = {
  title: 'SeoulScript',
  description: 'AI-crafted K-Drama scripts — short, emotional, inspiring.',
};

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-night-900 bg-sky-gradient min-h-screen antialiased">
        <div className="stars" />
        {children}
      </body>
    </html>
  );
}
