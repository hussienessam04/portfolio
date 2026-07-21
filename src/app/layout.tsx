export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata = {
  metadataBase: new URL('https://hussien.example.com'),
};
