export const metadata = {
  title: 'AgênciaOS',
  description: 'Plataforma SaaS para agências digitais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}