import Link from 'next/link';

const AgLogo = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 100 100"
  >
    <defs>
      <filter id="glow-footer" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="100" height="100" rx="20" fill="black" />
    <rect
      width="96"
      height="96"
      x="2"
      y="2"
      rx="18"
      stroke="hsl(var(--primary))"
      strokeWidth="4"
      fill="none"
      style={{ filter: 'url(#glow-footer)' }}
    />
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontFamily="Space Grotesk, sans-serif"
      fontSize="60"
      fontWeight="bold"
      fill="hsl(var(--primary))"
    >
      AG
    </text>
  </svg>
);


const Footer = () => {
  return (
    <footer className="w-full mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-cyan-300/10 text-slate-400 text-sm">
          <div className="flex items-center gap-2 text-center sm:text-right">
            <AgLogo size={20} />
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
