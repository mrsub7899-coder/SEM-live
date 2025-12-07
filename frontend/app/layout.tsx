import { AuthProvider } from "../context/AuthContext";
import TopNav from "../components/TopNav";
import './globals.css';

export const metadata = { title: "SEM" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          <TopNav />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
