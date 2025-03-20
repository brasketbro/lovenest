import { useState } from "react";
import { Link, useLocation } from "wouter";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl md:text-3xl font-['Dancing_Script'] text-primary font-bold">
          Mehak & Swapnil
        </Link>
        <nav className="hidden md:flex">
          <ul className="flex space-x-8">
            <li>
              <Link href="/" className={`${isActive('/') ? 'text-primary' : 'text-neutral-800'} hover:text-primary transition-colors`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/gallery" className={`${isActive('/gallery') ? 'text-primary' : 'text-neutral-800'} hover:text-primary transition-colors`}>
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/countdown" className={`${isActive('/countdown') ? 'text-primary' : 'text-neutral-800'} hover:text-primary transition-colors`}>
                Our Time
              </Link>
            </li>
            <li>
              <Link href="/messages" className={`${isActive('/messages') ? 'text-primary' : 'text-neutral-800'} hover:text-primary transition-colors`}>
                Love Notes
              </Link>
            </li>
            <li>
              <Link href="/bucket-list" className={`${isActive('/bucket-list') ? 'text-primary' : 'text-neutral-800'} hover:text-primary transition-colors`}>
                Bucket List
              </Link>
            </li>
          </ul>
        </nav>
        <button className="md:hidden text-neutral-800" id="mobile-menu-button" onClick={toggleMenu}>
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
      <div className={`mobile-menu ${isMenuOpen ? '' : 'hidden'} bg-white shadow-lg absolute w-full`} id="mobile-menu">
        <ul className="py-2 px-4 space-y-3">
          <li>
            <Link 
              href="/" 
              className={`block ${isActive('/') ? 'text-primary' : 'text-neutral-800'} hover:text-primary py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/gallery" 
              className={`block ${isActive('/gallery') ? 'text-primary' : 'text-neutral-800'} hover:text-primary py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link 
              href="/countdown" 
              className={`block ${isActive('/countdown') ? 'text-primary' : 'text-neutral-800'} hover:text-primary py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              Our Time
            </Link>
          </li>
          <li>
            <Link 
              href="/messages" 
              className={`block ${isActive('/messages') ? 'text-primary' : 'text-neutral-800'} hover:text-primary py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              Love Notes
            </Link>
          </li>
          <li>
            <Link 
              href="/bucket-list" 
              className={`block ${isActive('/bucket-list') ? 'text-primary' : 'text-neutral-800'} hover:text-primary py-2`}
              onClick={() => setIsMenuOpen(false)}
            >
              Bucket List
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
