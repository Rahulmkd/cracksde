import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-zinc-950 text-zinc-100">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 font-mono text-2xl font-bold">
          404
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          Page Not Found
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The page or resource you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Home
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/dashboard">
              <Home className="h-3.5 w-3.5 mr-1.5" /> Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
