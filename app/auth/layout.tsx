import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";


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
        <Link href={"/"}>
        <Image src={"/BookItNow.png"} width={100} height={100} alt={"logo"} />
      </Link>
        {children}
      </div>
  );
}
