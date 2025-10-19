import './globals.css';

export const metadata = {
  title: 'MicroPropiedad - Bitcoin Real Estate Investment',
  description: 'Invest in fractional real estate with Bitcoin on Stacks blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
