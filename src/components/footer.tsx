import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-cyan-300/10 text-slate-400 text-sm">
          <div className="flex items-center gap-2 text-center sm:text-right">
            <Image
                src="https://storage.googleapis.com/maker-studio-5f33a.appspot.com/users/user-lK2DvxQd2q2v62i3Y3dJ/studios/studio-1lF6t7l1v7j8n8s9k9h9/1723150536480-logo.png?alt=media"
                alt="AG Logo"
                width={20}
                height={20}
                className="rounded-sm hidden sm:block"
            />
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
