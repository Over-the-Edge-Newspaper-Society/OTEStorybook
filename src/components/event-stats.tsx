import type { Event, EventMetadata } from "@/types";

interface EventStatsProps {
  events: Event[];
  eventMetadata: Record<string, EventMetadata>;
}

export function EventStats({ events, eventMetadata }: EventStatsProps) {
  const stats = {
    total: events.length,
    thisWeek: events.filter(e => {
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return e.startDate >= weekStart && e.startDate <= weekEnd;
    }).length,
    free: events.filter(e => {
      const metadata = eventMetadata[e.id];
      return metadata?.cost === "Free";
    }).length,
    requireRegistration: events.filter(e => {
      const metadata = eventMetadata[e.id];
      return metadata?.registrationRequired;
    }).length
  };

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
        <div className="text-xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Total Events</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
        <div className="text-xl font-bold text-green-600">{stats.thisWeek}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">This Week</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
        <div className="text-xl font-bold text-purple-600">{stats.free}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Free Events</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
        <div className="text-xl font-bold text-orange-600">{stats.requireRegistration}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Need Registration</div>
      </div>
    </div>
  );
}
