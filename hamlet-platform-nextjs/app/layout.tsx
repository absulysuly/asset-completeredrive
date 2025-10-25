export const metadata = {
  title: 'Iraqi Election Platform',
  description: 'Democratic platform for Iraqi parliamentary elections',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial' }}>{children}</body>
    </html>
  )
}
