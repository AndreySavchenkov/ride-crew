"use client";

import { useSyncExternalStore, type ComponentProps, type ReactNode } from "react";
import {
  Plasma,
  PlasmaProvider,
  type Mood,
  type PlasmaOwnProps,
} from "@cruxgarden/plasma-ui";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// @cruxgarden/plasma-ui не помечает свой бандл "use client", поэтому все
// обёртки живут здесь — серверные компоненты импортируют их отсюда и
// передают только сериализуемые пропсы (строки, children).
//
// Правила, которые держат картинку чистой (см. README библиотеки):
// - Plasma-поверхности не вкладываются друг в друга: перекрывающиеся
//   поверхности сливаются в одну. Кнопки внутри панели — обычный DOM
//   (классы glass-* в globals.css), а не LiquidButton.
// - Соседние поверхности ближе BLEND px друг к другу соединяются жидким
//   мостиком, поэтому между отдельными панелями/кнопками отступ >= gap-6.
// - Одна панель на список, а не на каждую строку: число поверхностей на
//   экране ограничено MAX_SURFACES, лишние просто не рисуются.

const BLEND = 20;
const MAX_SURFACES = 24;

const crewMood: Mood = {
  colors: ["#090b0d", "#103a2e", "#2fa37a"],
  blend: BLEND,
  spring: { stiffness: 170, damping: 16 },
};

export const TINTS = {
  primary: "#1f9d74",
  neutral: "#ffffff",
  destructive: "#e5484d",
  going: "#10b981",
  maybe: "#f59e0b",
  notGoing: "#ef4444",
} as const;

export type Tint = keyof typeof TINTS;

const coarsePointerQuery = "(pointer: coarse)";

function subscribeCoarse(onChange: () => void) {
  const mql = window.matchMedia(coarsePointerQuery);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function PlasmaRoot({ children }: { children: ReactNode }) {
  // На телефонах эффект тяжёлый: снижаем пиксельную плотность canvas и
  // замораживаем кадр на время скролла-флинга.
  const isTouch = useSyncExternalStore(
    subscribeCoarse,
    () => window.matchMedia(coarsePointerQuery).matches,
    () => false
  );

  return (
    <PlasmaProvider
      mood={crewMood}
      theme="dark"
      radius={20}
      frost={0.35}
      elevation={0.3}
      maxSurfaces={MAX_SURFACES}
      quality={isTouch ? 0.75 : 1.25}
      freezeOnScroll
      pointerDrop={!isTouch}
    >
      {children}
    </PlasmaProvider>
  );
}

// Нативные пропы без тех, что Plasma определяет сама (draggable,
// onDragStart и т.п. — у HTML другие сигнатуры). `as` у next/link —
// устаревший href-декоратор, а не полиморфный `as` Plasma.
type Native<P> = Omit<P, "ref" | "as" | keyof PlasmaOwnProps>;

type PanelProps = Native<ComponentProps<"div">> & {
  as?: "div" | "section" | "header" | "footer" | "form";
  radius?: number;
  bar?: boolean;
  // Лёгкий цветовой оттенок панели (например, списки «идут / не идут»).
  tint?: Tint;
};

// Контейнер-панель: шапка, карточка, список. `bar` — для неподвижного
// хрома (шапка), который не сливается с соседями и не наклоняется.
export function Panel({ as = "div", radius, bar, tint, className, ...props }: PanelProps) {
  return (
    <Plasma
      as={as}
      radius={radius}
      lean={bar ? false : 6}
      fuse={!bar}
      tint={tint ? TINTS[tint] : undefined}
      opacity={tint ? 0.1 : undefined}
      className={className}
      {...props}
    />
  );
}

type PanelLinkProps = Native<ComponentProps<typeof Link>> & {
  radius?: number;
};

export function PanelLink({ radius, className, ...props }: PanelLinkProps) {
  return <Plasma as={Link} radius={radius} lean={6} className={className} {...props} />;
}

const liquidButtonBase =
  "inline-flex cursor-pointer items-center justify-center gap-2 font-label text-xs uppercase tracking-wide whitespace-nowrap text-white transition-opacity select-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const liquidButtonSizes = {
  sm: "h-9 px-4",
  md: "h-11 px-6 text-sm",
} as const;

type LiquidStyle = {
  tint?: Tint;
  // Насколько сильно кнопка окрашена: 0 — чистое стекло, 1 — сплошной цвет.
  strength?: number;
  size?: keyof typeof liquidButtonSizes;
};

function liquidProps({ tint = "primary", strength, size = "md" }: LiquidStyle) {
  const opacity = strength ?? (tint === "neutral" ? 0.04 : 0.5);
  return {
    tint: TINTS[tint],
    opacity,
    radius: size === "sm" ? 18 : 22,
    lean: 4,
    elevation: 0.25,
    sizeClassName: liquidButtonSizes[size],
  };
}

type LiquidButtonProps = Native<ComponentProps<"button">> & LiquidStyle;

export function LiquidButton({
  tint,
  strength,
  size,
  className,
  type = "button",
  ...props
}: LiquidButtonProps) {
  const { sizeClassName, ...surface } = liquidProps({ tint, strength, size });
  return (
    <Plasma
      as="button"
      type={type}
      {...surface}
      className={cn(liquidButtonBase, sizeClassName, className)}
      {...props}
    />
  );
}

type LiquidLinkProps = Native<ComponentProps<typeof Link>> & LiquidStyle;

export function LiquidLink({ tint, strength, size, className, ...props }: LiquidLinkProps) {
  const { sizeClassName, ...surface } = liquidProps({ tint, strength, size });
  return (
    <Plasma
      as={Link}
      {...surface}
      className={cn(liquidButtonBase, sizeClassName, className)}
      {...props}
    />
  );
}

type LiquidAnchorProps = Native<ComponentProps<"a">> & LiquidStyle;

// Для внешних ссылок (маршрут на Strava/Komoot и т.п.), где next-intl Link не нужен.
export function LiquidAnchor({ tint, strength, size, className, ...props }: LiquidAnchorProps) {
  const { sizeClassName, ...surface } = liquidProps({ tint, strength, size });
  return (
    <Plasma
      as="a"
      {...surface}
      className={cn(liquidButtonBase, sizeClassName, className)}
      {...props}
    />
  );
}
