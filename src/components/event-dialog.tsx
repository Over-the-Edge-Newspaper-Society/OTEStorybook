import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Building2, DollarSign, Calendar, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import type { Event, EventMetadata } from "@/types";

interface EventDialogProps {
  event: Event | null;
  eventMetadata: Record<string, EventMetadata>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showCost?: boolean;
}

export function EventDialog({ event, eventMetadata, open, onOpenChange, showCost = true }: EventDialogProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);
  
  // Debug website URL
  React.useEffect(() => {
    if (event && eventMetadata[event.id]?.website) {
      console.log('Event website URL:', eventMetadata[event.id].website);
    }
  }, [event, eventMetadata]);

  if (!event) return null;

  const metadata = eventMetadata[event.id];
  
  // Function to create excerpt from description
  const createExcerpt = (text: string, maxLength: number = 180) => {
    if (!text || text.length <= maxLength) return text;
    
    // Find a good break point near the max length (prefer sentence end)
    const truncated = text.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');
    
    // Use sentence end if it's reasonably close, otherwise use last space
    const breakPoint = lastSentence > maxLength - 50 ? lastSentence + 1 : lastSpace;
    return text.substring(0, breakPoint > 0 ? breakPoint : maxLength).trim();
  };

  // Generate calendar links
  const generateCalendarLink = (type: 'google' | 'outlook' | 'apple') => {
    const startDate = event.startDate;
    const endDate = event.endDate || new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    switch (type) {
      case 'google':
        const googleUrl = new URL('https://calendar.google.com/calendar/render');
        googleUrl.searchParams.append('action', 'TEMPLATE');
        googleUrl.searchParams.append('text', event.title);
        googleUrl.searchParams.append('dates', `${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}`);
        googleUrl.searchParams.append('details', event.description || '');
        if (metadata?.location) {
          googleUrl.searchParams.append('location', metadata.location);
        }
        return googleUrl.toString();
        
      case 'outlook':
      case 'apple':
        // Both Outlook and Apple use the same .ics format
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//UNBC Calendar//Events//EN',
          'METHOD:PUBLISH',
          'BEGIN:VEVENT',
          `UID:${event.id}@unbc-calendar`,
          `DTSTART:${formatDateForGoogle(startDate)}`,
          `DTEND:${formatDateForGoogle(endDate)}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${event.description || ''}`,
          metadata?.location ? `LOCATION:${metadata.location}` : '',
          metadata?.website ? `URL:${metadata.website}` : '',
          `ORGANIZER;CN=${metadata?.organization || 'Over the Edge'}:MAILTO:ote@unbc.ca`,
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].filter(line => line).join('\n');
        
        return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
    }
  };

  const categoryStyles = {
    clubs: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary',
    unbc: 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary',
    organizations: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive',
    sports: 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent'
  } as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden bg-card border border-border sm:w-full p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">{event.title}</DialogTitle>
          {event.description && (
            <div className="mt-2">
              <DialogDescription className={`text-muted-foreground leading-relaxed break-words ${isDescriptionExpanded ? 'max-h-[40vh] overflow-y-auto pr-2' : ''}`}>
                {isDescriptionExpanded ? event.description : createExcerpt(event.description)}
              </DialogDescription>
              {event.description.length > 180 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="inline-flex items-center gap-1 mt-3 px-3 py-2 text-sm text-primary hover:text-primary/80 hover:bg-primary/10 active:bg-primary/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {isDescriptionExpanded ? (
                    <>
                      Show less
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read more
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <div className="space-y-1 text-foreground">
                <div className="font-medium">
                  {event.startDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-muted-foreground text-sm">
                  {event.startDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                  {event.endDate && ` - ${event.endDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}`}
                </div>
              </div>
            </div>
            
            {metadata && (
              <div className="space-y-2 text-sm text-foreground">
                {metadata.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span>{metadata.location}</span>
                  </div>
                )}
                
                {metadata.organization && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span>{metadata.organization}</span>
                  </div>
                )}

                {showCost && metadata.cost && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span>{metadata.cost}</span>
                  </div>
                )}

                {metadata.website && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <a 
                      href={metadata.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block text-primary hover:text-primary/80 hover:underline transition-colors break-all cursor-pointer"
                      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                    >
                      Event Website
                    </a>
                  </div>
                )}
                
                <div className="flex items-center gap-3 pt-1">
                  {metadata.category && (
                    <Badge className={categoryStyles[metadata.category as keyof typeof categoryStyles] || 'bg-muted text-foreground'}>
                      {metadata.category.charAt(0).toUpperCase() + metadata.category.slice(1)}
                    </Badge>
                  )}
                  {metadata.registrationRequired && (
                    <Badge variant="outline" className="border-border text-foreground">Registration Required</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-col gap-2">
          <div className="text-sm text-muted-foreground mb-2">Add to your calendar:</div>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1 border-border bg-card text-foreground hover:bg-muted text-xs sm:text-sm"
              onClick={() => window.open(generateCalendarLink('google'), '_blank')}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Google
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-border bg-card text-foreground hover:bg-muted text-xs sm:text-sm"
              onClick={() => {
                const link = generateCalendarLink('outlook');
                const a = document.createElement('a');
                a.href = link;
                a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
                a.click();
              }}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Outlook
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-border bg-card text-foreground hover:bg-muted text-xs sm:text-sm"
              onClick={() => {
                const link = generateCalendarLink('apple');
                const a = document.createElement('a');
                a.href = link;
                a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
                a.click();
              }}
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Apple
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
