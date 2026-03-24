import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Terminal, Home, Tag, User, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function XSocialIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.633 7.584H.48l8.6-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153Zm-1.291 19.496h2.04L6.486 3.236H4.298L17.61 20.649Z" />
    </svg>
  );
}

function GitHubSocialIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.08 1.84 2.82 1.31 3.51 1 .11-.78.42-1.31.76-1.61-2.66-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.39 1.23-3.24-.12-.31-.53-1.56.12-3.25 0 0 1.01-.33 3.3 1.24a11.34 11.34 0 0 1 6 0c2.29-1.57 3.29-1.24 3.29-1.24.66 1.69.25 2.94.12 3.25.77.85 1.23 1.93 1.23 3.24 0 4.61-2.81 5.62-5.49 5.92.43.38.81 1.11.81 2.25 0 1.62-.01 2.93-.01 3.33 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function LinkedInSocialIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.13 1.45-2.13 2.94v5.66H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.48v6.26ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77A1.78 1.78 0 0 0 0 1.77v20.46C0 23.2.8 24 1.77 24h20.45A1.78 1.78 0 0 0 24 22.23V1.77A1.78 1.78 0 0 0 22.22 0Z" />
    </svg>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/tags", label: "Tags", icon: Tag },
    { to: "/about", label: "About", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-gray-300 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0F14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group min-w-0">
              <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors flex-shrink-0">
                <Terminal className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-base sm:text-lg font-semibold tracking-tight text-white group-hover:text-blue-400 transition-colors truncate">
                ML <span className="text-blue-400 font-bold text-xl">Lab</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      isActive ? "text-white bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </NavLink>
                ))}
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                      isActive ? "text-blue-400 bg-blue-400/5" : "text-blue-400/70 hover:text-blue-400 hover:bg-blue-400/5"
                    )}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin</span>
                  </NavLink>
                )}
              </div>

              <div className="h-4 w-px bg-white/10" />

              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full border border-white/10" />
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={login}
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-4">
              {user && (
                <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-white/10" />
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                <span className="relative block w-6 h-6">
                  <motion.span
                    className="absolute left-0 top-[6px] block h-0.5 w-6 rounded-full bg-current"
                    animate={isMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                  />
                  <motion.span
                    className="absolute left-0 top-[11px] block h-0.5 w-6 rounded-full bg-current"
                    animate={isMenuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, ease: 'easeInOut' }}
                  />
                  <motion.span
                    className="absolute left-0 top-[16px] block h-0.5 w-6 rounded-full bg-current"
                    animate={isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <motion.div
              className="md:hidden border-t border-white/5 bg-[#0B0F14]"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <motion.div
                className="px-2 pt-2 pb-3 space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, delay: 0.04 }}
              >
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all",
                      isActive ? "text-white bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all text-blue-400",
                      isActive ? "bg-blue-400/5" : "hover:bg-blue-400/5"
                    )}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Admin Terminal</span>
                  </NavLink>
                )}
                <div className="pt-4 pb-2 px-4">
                  {user ? (
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="flex items-center space-x-3 w-full text-left text-gray-400 hover:text-white transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => { login(); setIsMenuOpen(false); }}
                      className="flex items-center space-x-3 w-full text-left text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In with Google</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {children}
      </main>

      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} HeaLer's Notebook. Built for the future.</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Code-name-HeaLer"
              aria-label="GitHub"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <GitHubSocialIcon className="w-6 h-6" />
            </a>
            <a
              href="https://x.com/Codename_Healer"
              aria-label="Twitter"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <XSocialIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/swagat-prasad-nanda"
              aria-label="LinkedIn"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LinkedInSocialIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
