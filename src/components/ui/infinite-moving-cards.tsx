"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  rowCount = 1,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  rowCount?: number;
  className?: string;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const normalizedRowCount = Math.max(1, Math.floor(rowCount));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const duplicatedItems = useMemo(
    () => [...items, ...items],
    [items]
  );

  const animationDuration = useMemo(() => {
    if (speed === "fast") return "20s";
    if (speed === "normal") return "40s";
    return "80s";
  }, [speed]);

  const resolveRowDirection = (rowIndex: number) => {
    if (rowIndex % 2 === 0) return direction;
    return direction === "left" ? "right" : "left";
  };

  return (
    <div
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden space-y-2",
        className
      )}
    >
      {Array.from({ length: normalizedRowCount }).map((_, rowIndex) => {
        const rowDirection = resolveRowDirection(rowIndex);
        return (
          <ul
            key={`confession-row-${rowIndex}`}
            className={cn(
              "flex w-max min-w-full shrink-0 flex-nowrap gap-2 py-2",
              isMounted && "animate-scroll",
              pauseOnHover && "hover:[animation-play-state:paused]"
            )}
            style={{
              animationDuration,
              animationDirection: rowDirection === "left" ? "normal" : "reverse",
            }}
            aria-label={`Confession row ${rowIndex + 1}`}
          >
            {duplicatedItems.map((item, idx) => (
              <li
                className="relative w-[350px] max-w-full flex-shrink-0 rounded-2xl border border-border bg-card px-8 py-6 text-card-foreground transition-colors duration-300 md:w-[450px]"
                key={`${rowIndex}-${idx}-${item.name}`}
              >
                <blockquote>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-0.5 -top-0.5 -z-10 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)] rounded-2xl bg-gradient-to-b from-white/5 to-transparent dark:from-white/10"
                  ></div>
                  <span className="relative z-20 text-sm font-normal leading-[1.6] text-foreground dark:text-card-foreground">
                    {item.quote}
                  </span>
                  <div className="relative z-20 mt-6 flex flex-row items-center">
                    <span className="flex flex-col gap-1">
                      <span className="text-sm font-semibold leading-[1.6] text-primary">
                        {item.name}
                      </span>
                      {item.title && (
                        <span className="text-sm font-normal leading-[1.6] text-muted-foreground">
                          {item.title}
                        </span>
                      )}
                    </span>
                  </div>
                </blockquote>
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
};
