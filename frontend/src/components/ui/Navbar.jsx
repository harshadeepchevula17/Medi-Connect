import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Services", id: "services" },
    { name: "Doctors", id: "doctors" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="h-16 md:h-18 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-base">
              M
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                MediConnect
              </h1>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative font-medium transition-colors duration-300 ${
                  activeSection === item.id
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {item.name}

                <span
                  className={`absolute left-0 -bottom-2 h-[2.5px] bg-blue-600 rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? "w-full"
                      : "w-0"
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}