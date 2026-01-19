'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Sushi', path: '/sushi' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-white py-3'
      }`}
    >
      <div className="container flex items-center justify-between h-full md:flex-row md:justify-between md:items-center flex-col md:h-full">
        {/* Logo - centered on mobile */}
        <Link href="/" className="flex items-center justify-center w-full md:w-auto mb-2 md:mb-0" onClick={closeMenu}>
          <Image
            src="/SweetLifeLogoWeb3.png"
            alt="Sweet Life Logo"
            width={120}
            height={48}
            className="h-12 w-auto mx-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex md:items-center">
          <ul className="flex items-center space-x-1 h-full">
            {/* Home link */}
            <li>
              <Link
                href="/"
                className={`nav-link flex items-center h-full ${pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>
            {/* Menu dropdown - second item */}
            <li className="relative group" onMouseEnter={() => setMenuDropdownOpen(true)} onMouseLeave={() => setMenuDropdownOpen(false)}>
              <button
                className={`nav-link flex items-center h-full px-4 py-2 focus:outline-none ${pathname === '/menu' || pathname === '/specialty-menu' ? 'active' : ''}`}
                onClick={() => setMenuDropdownOpen((v) => !v)}
                type="button"
                aria-haspopup="true"
                aria-expanded={menuDropdownOpen}
              >
                Menu
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {/* Dropdown - flush with button, no margin */}
              <div className={`absolute left-0 top-full w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 transition-all duration-200 ${menuDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                onMouseEnter={() => setMenuDropdownOpen(true)}
                onMouseLeave={() => setMenuDropdownOpen(false)}
              >
                <Link href="/menu" className="block px-5 py-3 text-stone-800 hover:bg-stone-100 font-medium text-center" onClick={() => setMenuDropdownOpen(false)}>
                  Full Menu
                </Link>
                <Link href="/specialty-menu" className="block px-5 py-3 text-stone-800 hover:bg-stone-100 font-medium flex items-center justify-center" onClick={() => setMenuDropdownOpen(false)}>
                  <span className="mr-2">✨</span><span>Specialty Menu</span>
                </Link>
              </div>
            </li>
            {/* Other nav links */}
            {navLinks.slice(1).map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className={`nav-link flex items-center h-full ${pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://www.foodserveadmin.com/ordering/restaurant/menu?restaurant_uid=bf3e6aff-e235-4431-a82f-c5653e976642&client_is_mobile=true"
                className="btn btn-primary btn-glow ml-4 flex items-center gap-2 whitespace-nowrap"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShoppingBag size={18} />
                Order Now
              </a>
            </li>
          </ul>
        </nav>

        {/* Hamburger menu button - right on mobile */}
        <button
          className="md:hidden text-stone-700 focus:outline-none flex items-center justify-center mt-2 absolute right-4 top-1/2 transform -translate-y-1/2 md:static md:transform-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <ul className="container py-4 space-y-2 flex flex-col items-center">
          {/* Mobile Menu Dropdown - second item after Home */}
          <li className="w-full flex justify-center">
            <Link
              href="/"
              className={`block py-2 px-4 rounded-md text-center w-full ${
                pathname === '/' ? 'bg-primary/10 text-primary font-medium' : 'text-stone-700 hover:bg-stone-100'
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li className="w-full flex flex-col items-center">
            <button
              className={`block py-2 px-4 rounded-md text-center w-full text-stone-700 hover:bg-stone-100 font-medium flex items-center justify-center ${pathname === '/menu' || pathname === '/specialty-menu' ? 'bg-primary/10 text-primary' : ''}`}
              onClick={() => setMenuDropdownOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menuDropdownOpen}
              type="button"
            >
              Menu
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`w-full transition-all duration-200 ${menuDropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
              style={{ background: 'white', borderRadius: '0.75rem' }}
            >
              <Link href="/menu" className="block px-5 py-3 text-stone-800 hover:bg-stone-100 font-medium text-center" onClick={() => { setMenuDropdownOpen(false); closeMenu(); }}>
                Full Menu
              </Link>
              <Link href="/specialty-menu" className="block px-5 py-3 text-stone-800 hover:bg-stone-100 font-medium flex items-center justify-center" onClick={() => { setMenuDropdownOpen(false); closeMenu(); }}>
                <span className="mr-2">✨</span><span>Specialty Menu</span>
              </Link>
            </div>
          </li>
          {navLinks.slice(1).map((link) => (
            <li key={link.name} className="w-full flex justify-center">
              <Link
                href={link.path}
                className={`block py-2 px-4 rounded-md text-center w-full ${
                  pathname === link.path
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="w-full flex justify-center">
            <a
              href="https://www.foodserveadmin.com/ordering/restaurant/menu?restaurant_uid=bf3e6aff-e235-4431-a82f-c5653e976642&client_is_mobile=true"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-primary text-stone-900 rounded-full font-semibold text-center w-full shadow-lg shadow-primary/25"
              onClick={closeMenu}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ShoppingBag size={18} />
              Order Now
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
