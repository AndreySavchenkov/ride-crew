export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0f1013]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} Ride Crew
        </p>

        <a
          href="https://instagram.com/sandvik_16/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/50 transition-colors hover:text-white"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
};
