import Link from "next/link";

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-lg text-gray-300 hover:text-green-400 transition-colors duration-300">
      {children}
    </Link>
  );
}
