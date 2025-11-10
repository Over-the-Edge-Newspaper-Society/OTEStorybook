import UNBCCalendar from '@/components/unbc-calendar';
import { TodayEventsWidget } from '@/components/today-events-widget';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <section className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-semibold">
            Over The Edge
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold">
            UNBC Events Calendar
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Interactive views of the campus event feed powered by the same React components that
            run inside the WordPress plugin. Switch tabs, filter events, or open the modal to see
            the full experience.
          </p>
        </section>

        <UNBCCalendar />

        <section className="grid gap-6 lg:grid-cols-2">
          <TodayEventsWidget />
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2">
              Living Storybook Preview
            </h2>
            <p className="text-muted-foreground text-sm">
              Run <code className="px-1 py-0.5 rounded bg-muted">npm run storybook</code> to explore these
              components in isolation with adjustable controls, accessibility audits, and documentation.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
