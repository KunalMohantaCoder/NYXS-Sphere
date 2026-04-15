import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'NYXS Sphere — Where Students Build the Future',
  description: 'A focused community for students and aspiring founders to share ideas, write blogs, and collaborate.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <div id="toast-container" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}