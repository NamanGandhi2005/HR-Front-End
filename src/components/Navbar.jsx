"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // This container is now sticky. It will stay at the top of the page when scrolling.
    // A background with blur has been added to ensure content scrolls cleanly underneath.
    <div className="relative w-full sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <Link to="/">
            <NavbarLogo />
          </Link>
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {/* Clerk Authentication Components */}
            <SignedOut>
                <SignInButton mode="modal">
                    <NavbarButton variant="secondary">Login</NavbarButton>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton afterSignOutUrl="/"/>
            </SignedIn>

            {/* "Try For Free" button remains unchanged */}
            <Link to="/chatbot">
              <NavbarButton variant="primary">Try For Free</NavbarButton>
            </Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
               {/* Clerk Authentication for Mobile */}
               <SignedOut>
                <SignInButton mode="modal">
                    <NavbarButton variant="secondary" className="w-full">Login</NavbarButton>
                </SignInButton>
               </SignedOut>
               <SignedIn>
                <UserButton afterSignOutUrl="/"/>
               </SignedIn>

              {/* Mobile "Try For Free" button */}
              <Link to="/chatbot" className="w-full">
                <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full">
                    Try For Free
                </NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

export default NavbarDemo;