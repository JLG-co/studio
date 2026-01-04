import Link from 'next/link';

const AgLogo = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className="rounded-sm"
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
