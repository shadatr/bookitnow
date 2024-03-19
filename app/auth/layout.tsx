import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "BookItNow",
  description: "Vacation rental website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        {children}
      </div>
  );
}
