'use client';

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, User, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mainNavLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/lessons', label: 'الدروس' },
  { href: '/exercises', label: 'التمارين' },
  { href: '/olympiad', label: 'الأولمبياد' },
  { href: '/lab', label: 'المختبر' },
];

const dropdownLinks = [
  { href: '/leaderboard', label: 'المتصدرون' },
  { href: '/adaptive-learning', label: 'التعلم التكيفي' },
  { href: '/articles', label: 'المقالات' },
  { href: '/changelog', label: 'التحديثات' },
  { href: '/about', label: 'عن المطور' },
]

const allLinks = [...mainNavLinks, ...dropdownLinks];

const AgLogo = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className="rounded-md"
  >
    <rect width="100" height="100" rx="20" className="fill-primary" />
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontFamily="Space Grotesk, sans-serif"
      fontSize="60"
      fontWeight="bold"
      className="fill-primary-foreground"
    >
      AG
    </text>
  </svg>
);


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
  
  const DropdownNavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname.startsWith(href) && (href !== '/' || pathname === '/');
    return (
      <DropdownMenuItem asChild>
        <Link
          href={href}
          className={cn(
            'text-lg font-medium transition-colors hover:text-primary focus:bg-background/50',
            isActive ? 'text-primary' : 'text-slate-300'
          )}
        >
          {label}
        </Link>
      </DropdownMenuItem>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between bg-background/30 backdrop-blur-lg border-b border-cyan-300/10 rounded-b-2xl px-6">
          <Link href="/" className="flex items-center gap-3 font-headline text-2xl font-bold">
            <AgLogo size={40} />
            <span className="hidden sm:inline">Math Companion Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {mainNavLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-lg font-medium text-slate-300 hover:text-primary data-[state=open]:text-primary">
                  المزيد
                  <ChevronDown className="w-5 h-5 mr-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background/80 backdrop-blur-xl border-cyan-300/10">
                {dropdownLinks.map((link) => (
                  <DropdownNavLink key={link.href} {...link} />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
                <Link href="/profile">
                    <User className="h-6 w-6" />
                    <span className="sr-only">Profile</span>
                </Link>
            </Button>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background/80 backdrop-blur-xl border-cyan-300/10">
                  <nav className="flex flex-col items-center justify-center h-full gap-8">
                    {allLinks.map((link) => (
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
