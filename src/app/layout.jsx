import "./globals.css";

export const metadata = {
  title: "ShoeShine SuperAdmin",
  description: "Dashboard SuperAdmin ShoeShine / CareKicks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
