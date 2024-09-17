import { Link } from "@nextui-org/link";
import { Navbar } from "@/components/navbar";
import { TopBar } from "@/components/topbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen max-w-full">
      <TopBar/>
      <Navbar />
      <main className="container mx-auto max-w-full flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="alhafs.com"
          title="Alhafs"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">AlHAFS</p>
        </Link>
      </footer>
    </div>
  );
}
