import { cookies } from "next/headers";

// Разумный дефолт, пока TimezoneSync ещё не успел проставить куку (самый
// первый запрос до гидратации) или JS вовсе отключён — не идеально для
// каждого зрителя, но лучше, чем всегда падать в UTC на сервере Vercel.
const DEFAULT_TIMEZONE = "Europe/Moscow";

export async function getViewerTimezone(): Promise<string> {
  const store = await cookies();
  const tz = store.get("tz")?.value;
  if (!tz) return DEFAULT_TIMEZONE;

  try {
    // Бросает, если это не настоящее IANA-имя пояса — кука ведь пришла от
    // клиента, доверять её содержимому вслепую нельзя.
    new Intl.DateTimeFormat(undefined, { timeZone: tz });
    return tz;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}
