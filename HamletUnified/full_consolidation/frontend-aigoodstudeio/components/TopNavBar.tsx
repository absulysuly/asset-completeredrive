import Link from 'next/link';

type NavigationLink = {
  href: string;
  label: string;
};

const LOGO_TEXT = 'Hamlet Unified';

const NAVIGATION_LINKS: ReadonlyArray<NavigationLink> = [
  { href: '/', label: 'Overview' },
  { href: '#features', label: 'Platform Features' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#contact', label: 'Contact' }
];

export default function TopNavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold text-primary">
          {LOGO_TEXT}
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {NAVIGATION_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="https://status.hamletunified.io"
            className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary md:inline-flex"
          >
            System Status
          </Link>
          <Link
            href="mailto:ops@hamletunified.io"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            Request Access
          </Link>
        </div>
      </div>
    </header>
  );
}
