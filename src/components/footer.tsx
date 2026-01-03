import Link from 'next/link';
import { FunctionSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-cyan-300/10 text-slate-400 text-sm">
          <div className="flex items-center gap-2 text-center sm:text-right">
            <FunctionSquare className="h-5 w-5 text-primary hidden sm:block" />
            <p>
              &copy; {new Date().getFullYear()} Math Companion Pro
            </p>
          </div>
          <div className="text-center">
            <p>
              Developed by{' '}
              <Link href="/about" className="font-semibold text-primary hover:underline">
                Abdeldjalil Gouneiber (AG)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
