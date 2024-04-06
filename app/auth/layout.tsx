import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        <Link href={"/"}>
        <Image src={"/BookItNow.png"} width={150} height={100} alt={"logo"} />
      </Link>
        {children}
      </div>
  );
}
