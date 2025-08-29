import Navbar from '../components/navbar';
import './global.css';

export const metadata = {
  title: 'Social Media App',
  description: 'Instagram-style app built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}