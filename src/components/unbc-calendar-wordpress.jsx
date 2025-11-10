import React, { useState, useEffect } from 'react';
import UNBCCalendar from './unbc-calendar';

// Configuration - you can modify these or pass them as props
const WORDPRESS_API_URL = '../wp-json/wp/v2';
const USE_WORDPRESS_DATA = false; // Set to true to fetch from WordPress

export default function UNBCCalendarWordPress() {
  const [wpEvents, setWpEvents] = useState(null);
  const [loading, setLoading] = useState(USE_WORDPRESS_DATA);

  useEffect(() => {
    if (USE_WORDPRESS_DATA) {
      fetchWordPressEvents();
    }
  }, []);

  const fetchWordPressEvents = async () => {
    try {
      // Fetch events from WordPress REST API
      const response = await fetch(`${WORDPRESS_API_URL}/events?per_page=100`);
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const events = await response.json();
      
      // Transform WordPress events to your format
      const transformedEvents = events.map(wpEvent => ({
        id: wpEvent.id.toString(),
        title: wpEvent.title.rendered,
        description: wpEvent.excerpt.rendered.replace(/<[^>]*>/g, ''),
        startDate: new Date(wpEvent.meta.event_date),
        endDate: wpEvent.meta.event_end_date ? new Date(wpEvent.meta.event_end_date) : new Date(wpEvent.meta.event_date),
        location: wpEvent.meta.event_location || 'TBD',
        isAllDay: !wpEvent.meta.event_time,
        registrationUrl: wpEvent.meta.event_registration_url,
      }));

      const metadata = {};
      events.forEach((wpEvent, index) => {
        metadata[transformedEvents[index].id] = {
          category: wpEvent.meta.event_category || 'academic',
          organization: wpEvent.meta.event_organization || 'UNBC',
          location: wpEvent.meta.event_location || 'TBD',
          cost: wpEvent.meta.event_cost || 'Free',
          registrationRequired: !!wpEvent.meta.event_registration_url,
          posterUrl: wpEvent.featured_media ? wpEvent._embedded?.['wp:featuredmedia']?.[0]?.source_url : null,
          contact: {
            email: wpEvent.meta.event_contact_email,
            phone: wpEvent.meta.event_contact_phone,
          },
          capacity: wpEvent.meta.event_capacity,
        };
      });

      setWpEvents({ events: transformedEvents, metadata });
    } catch (error) {
      console.error('Error fetching WordPress events:', error);
      // Fall back to demo data
      setWpEvents(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  // Use WordPress data if available, otherwise use demo data
  return <UNBCCalendar wpData={wpEvents} />;
}