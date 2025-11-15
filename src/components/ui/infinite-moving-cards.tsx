"use client";

import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type ConfessionItem = {
  quote: string;
  name: string;
  title?: string;
};

type TestimonialItem = {
  text: string;
  image?: string;
  name: string;
  role?: string;
};

type AnimationSpeed = "fast" | "normal" | "slow";

type BaseProps = {
  direction?: "left" | "right";
  speed?: AnimationSpeed;
  pauseOnHover?: boolean;
  rowCount?: number;
  className?: string;
};

type ConfessionProps = BaseProps & {
  variant?: "confession";
  items: ConfessionItem[];
};

type TestimonialProps = BaseProps & {
  variant: "testimonials";
  items: TestimonialItem[];
};

type InfiniteMovingCardsProps = ConfessionProps | TestimonialProps;

const testimonialDurationFromSpeed = (speed: AnimationSpeed) => {
  if (speed === "fast") return 15;
  if (speed === "normal") return 18;
  return 22;
};

const chunkTestimonials = (items: TestimonialItem[], columnCount: number) => {
  if (columnCount <= 1) return [items];
  const size = Math.ceil(items.length / columnCount) || 1;
  return Array.from({ length: columnCount }, (_, index) =>
    items.slice(index * size, (index + 1) * size)
  ).filter((column) => column.length > 0);
};

const TestimonialsColumn: React.FC<{
  className?: string;
  testimonials: TestimonialItem[];
  duration: number;
  pauseOnHover: boolean;
}> = ({ className, testimonials, duration, pauseOnHover }) => {
  const controls = useAnimationControls();

  const startLoop = useCallback(
    () =>
      controls.start({
        translateY: "-50%",
        transition: {
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        },
      }),
    [controls, duration]
  );

  useEffect(() => {
    startLoop();
    return () => controls.stop();
    // re-run when duration changes so the speed updates
  }, [controls, startLoop]);

  const handleHoverStart = () => {
    if (pauseOnHover) controls.stop();
  };

  const handleHoverEnd = () => {
    if (pauseOnHover) startLoop();
  };

  return (
    <div className={className}>
      <motion.div
        initial={{ translateY: 0 }}
        animate={controls}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <React.Fragment key={`testimonial-loop-${index}`}>
            {testimonials.map(({ text, image, name, role }, itemIndex) => (
              <div
                className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full"
                key={`${index}-${itemIndex}-${name}`}
              >
                <div>{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  {image ? (
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                      {name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">{name}</div>
                    {role && <div className="leading-5 opacity-60 tracking-tight">{role}</div>}
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialsLayout: React.FC<{
  items: TestimonialItem[];
  speed: AnimationSpeed;
  pauseOnHover: boolean;
  rowCount?: number;
  className?: string;
}> = ({ items, speed, pauseOnHover, rowCount, className }) => {
  const columnCount = Math.max(1, Math.floor(rowCount ?? 3));
  const columns = useMemo(
    () => chunkTestimonials(items, columnCount),
    [items, columnCount],
  );
  const baseDuration = testimonialDurationFromSpeed(speed);

  return (
    <section className={cn("bg-background my-10 relative", className)}>
      <div className="container z-10 mx-auto">
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75">
            See what our customers have to say about us.
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          {columns.map((columnItems, columnIndex) => {
            const durationOffset = columnIndex === 1 ? 4 : columnIndex === 2 ? 2 : 0;
            const visibilityClass =
              columnIndex === 0
                ? ""
                : columnIndex === 1
                ? "hidden md:block"
                : "hidden lg:block";

            return (
              <TestimonialsColumn
                key={`testimonial-column-${columnIndex}`}
                testimonials={columnItems}
                duration={baseDuration + durationOffset}
                pauseOnHover={pauseOnHover}
                className={visibilityClass}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ConfessionMarquee: React.FC<ConfessionProps> = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  rowCount,
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const normalizedRowCount = Math.max(1, Math.floor(rowCount ?? 1));

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

export const InfiniteMovingCards = (props: InfiniteMovingCardsProps) => {
  if (props.variant === "testimonials") {
    const { items, speed = "fast", pauseOnHover = true, rowCount, className } = props;
    return (
      <TestimonialsLayout
        items={items}
        speed={speed}
        pauseOnHover={pauseOnHover}
        rowCount={rowCount}
        className={className}
      />
    );
  }

  return <ConfessionMarquee {...props} />;
};
