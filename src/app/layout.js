import './globals.css';

export const metadata = {
  title: 'Mood Tracker',
  description: 'Track your mood daily',
  icons: {
    icon: '/favicon.ico', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}