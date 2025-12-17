import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  currentView?: "home" | "orders";
  onNavigate?: (view: "home" | "orders") => void;
}
const navLinks = [
  {
    title: "Register Partner",
    href: "/register",
  },
  {
    title: "Supply Chain",
    href: "/control-supply-chain",
  },
  {
    title: "Order",
    href: "/order-medicine",
  },
  {
    title: "Track",
    href: "/track-medicine",
  },
];

const Header: React.FC<HeaderProps> = ({
  currentView = "home",
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, item: string) => {
    e.preventDefault();
    if (!onNavigate) return;

    if (item === "Order") {
      onNavigate("orders");
    } else {
      onNavigate("home");
      // Optional: scroll to section if needed, but for now just switching view
      if (item !== "Partner" && item !== "About" && item !== "Track") {
        window.scrollTo(0, 0);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const goHome = () => {
    if (onNavigate) {
      onNavigate("home");
      window.scrollTo(0, 0);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || currentView === "orders"
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={goHome}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <a
            href="/"
            className="font-bold text-xl text-slate-900 tracking-tight"
          >
            Web3Pharma
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item.title}
              href={`${item.href}`}
              className={`text-sm font-medium transition-colors`}
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-6 shadow-lg md:hidden flex flex-col gap-4">
          {["Partner", "Order", "Track", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-lg font-medium text-slate-600"
              onClick={(e) => handleNavClick(e, item)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
