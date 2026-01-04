'use client';

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/lessons', label: 'الدروس' },
  { href: '/exercises', label: 'التمارين' },
  { href: '/olympiad', label: 'الأولمبياد' },
  { href: '/leaderboard', label: 'المتصدرون' },
  { href: '/lab', label: 'المختبر' },
  { href: '/articles', label: 'المقالات' },
  { href: '/adaptive-learning', label: 'التعلم التكيفي' },
  { href: '/about', label: 'عن المطور' },
];

const Header = () => {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname.startsWith(href) && (href !== '/' || pathname === '/');
    return (
      <Link
        href={href}
        onClick={() => setSheetOpen(false)}
        className={cn(
          'text-lg font-medium transition-colors hover:text-primary',
          isActive ? 'text-primary' : 'text-slate-300'
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between bg-background/30 backdrop-blur-lg border-b border-cyan-300/10 rounded-b-2xl px-6">
          <Link href="/" className="flex items-center gap-3 font-headline text-2xl font-bold">
            <Image
                src="https://storage.googleapis.com/maker-studio-5f33a.appspot.com/users/user-lK2DvxQd2q2v62i3Y3dJ/studios/studio-1lF6t7l1v7j8n8s9k9h9/1723150536480-logo.png?alt=media"
                alt="AG Logo"
                width={40}
                height={40}
                className="rounded-md"
            />
            <span className="hidden sm:inline">Math Companion Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
                <Link href="/profile">
                    <User className="h-6 w-6" />
                    <span className="sr-only">Profile</span>
                </Link>
            </Button>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background/80 backdrop-blur-xl border-cyan-300/10">
                  <nav className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map((link) => (
                      <NavLink key={link.href} {...link} />
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
