import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';

const meta: Meta<typeof InfiniteMovingCards> = {
  title: 'UNBC/Confessions',
  component: InfiniteMovingCards,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InfiniteMovingCards>;

const StoryCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative flex h-[40rem] w-full flex-col items-center justify-center overflow-hidden rounded-md bg-background text-foreground transition-colors duration-300 dark:[background-image:radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_45%)]">
    {children}
  </div>
);

// Sample confessions data
const confessions = [
  {
    quote: "I may have puked on some guys shoes last night. It's not the first time. To that guy, my bad.",
    name: "#1894",
    title: "",
  },
  {
    quote: "To all those assholes who insist on walking SIDE-BY-SIDE through the hallways and up stairs... What the fuck. It's annoying as fuck. Quit it.",
    name: "#1892",
    title: "",
  },
  {
    quote: "Apologies to the entire student population especially anyone who passed through the main floor of T&L on Friday. I nuked a bathroom in there. Fuck near levelled that building. Sorry. I'm better now tho.",
    name: "#1887",
    title: "",
  },
  {
    quote: "Why does the cafeteria always run out of the good stuff by noon? Some of us have afternoon classes and want actual food, not just crumbs.",
    name: "#1895",
    title: "",
  },
  {
    quote: "I've been secretly eating my lunch in the library study rooms because the cafeteria is too loud and I have no friends to sit with. Is that weird?",
    name: "#1890",
    title: "",
  },
  {
    quote: "To whoever keeps leaving their dishes in the communal kitchen sink: your mother doesn't live here. Clean up after yourself.",
    name: "#1888",
    title: "",
  },
];

const confessionTestimonials = confessions.map((confession) => ({
  text: confession.quote,
  name: confession.name,
  role: confession.title || "UNBC Confession",
}));

const confessionDeck = confessions.map((confession, index) => ({
  tempId: index,
  testimonial: confession.quote,
  by: confession.title ? `${confession.name} — ${confession.title}` : confession.name,
}));

export const Default: Story = {
  render: (args) => (
    <StoryCanvas>
      <InfiniteMovingCards {...args} />
    </StoryCanvas>
  ),
  args: {
    items: confessions,
    direction: "right",
    speed: "slow",
    pauseOnHover: true,
    rowCount: 1,
  },
};

export const FastScrolling: Story = {
  render: (args) => (
    <StoryCanvas>
      <InfiniteMovingCards {...args} />
    </StoryCanvas>
  ),
  args: {
    items: confessions,
    direction: "left",
    speed: "fast",
    pauseOnHover: true,
    rowCount: 1,
  },
};

export const NormalSpeed: Story = {
  render: (args) => (
    <StoryCanvas>
      <InfiniteMovingCards {...args} />
    </StoryCanvas>
  ),
  args: {
    items: confessions,
    direction: "right",
    speed: "normal",
    pauseOnHover: true,
    rowCount: 1,
  },
};

export const LeftDirection: Story = {
  render: (args) => (
    <StoryCanvas>
      <InfiniteMovingCards {...args} />
    </StoryCanvas>
  ),
  args: {
    items: confessions,
    direction: "left",
    speed: "slow",
    pauseOnHover: true,
    rowCount: 1,
  },
};

export const NoPauseOnHover: Story = {
  render: (args) => (
    <StoryCanvas>
      <InfiniteMovingCards {...args} />
    </StoryCanvas>
  ),
  args: {
    items: confessions,
    direction: "right",
    speed: "slow",
    pauseOnHover: false,
    rowCount: 1,
  },
};

export const DoubleStack: Story = {
  render: (args) => (
    <StoryCanvas>
      <InfiniteMovingCards {...args} />
    </StoryCanvas>
  ),
  args: {
    items: confessions,
    direction: "left",
    speed: "normal",
    pauseOnHover: true,
    rowCount: 2,
  },
};

export const TripleStack: Story = {
  render: (args) => (
    <StoryCanvas>
      <InfiniteMovingCards {...args} />
    </StoryCanvas>
  ),
  args: {
    items: confessions,
    direction: "left",
    speed: "slow",
    pauseOnHover: true,
    rowCount: 3,
  },
};

export const TestimonialsVariant: Story = {
  render: (args) => <InfiniteMovingCards {...args} />,
  args: {
    items: confessionTestimonials,
    variant: "testimonials",
    speed: "fast",
    pauseOnHover: true,
    rowCount: 3,
  },
};

export const StaggeredCards: Story = {
  render: () => (
    <div className="flex w-full h-[40rem] items-center justify-center bg-background">
      <StaggerTestimonials items={confessionDeck} />
    </div>
  ),
};

export const StaggeredCardsDocs: Story = {
  render: () => (
    <div className="flex w-full h-[40rem] items-center justify-center bg-background">
      <StaggerTestimonials items={confessionDeck} variant="docs" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A variant that displays the confession number at the top using the Salted font, without the quote symbol.',
      },
    },
  },
};
