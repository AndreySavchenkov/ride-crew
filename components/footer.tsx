import { getTranslations } from "next-intl/server";

export const Footer = async () => {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t-2 bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <p className="font-label text-xs uppercase text-muted-foreground">
          {t("rights", { year: new Date().getFullYear() })}
        </p>

        <a
          href="https://instagram.com/sandvik_16/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-label text-xs uppercase text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("instagram")}
        </a>
      </div>
    </footer>
  );
};
