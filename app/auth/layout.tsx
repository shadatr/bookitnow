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
        <Image src={"/BookItNow.png"} width={150} height={100} alt={"logo"} className="fixed top-0 left-0 m-5" />
      </Link>
        {children}
      </div>
  );
}
