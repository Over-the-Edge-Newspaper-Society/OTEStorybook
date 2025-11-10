// Utility functions for handling category colors and variants across all calendar views

export type CategoryVariant = 
  | 'default'  // Gray
  | 'primary'  // Purple
  | 'success'  // Green
  | 'danger'   // Red
  | 'warning'  // Blue
  | 'orange'   // Orange
  | 'cyan'     // Cyan
  | 'pink'     // Pink
  | 'indigo'   // Indigo
  | 'yellow';  // Yellow

export interface EventCategoryInfo {
  id: number;
  name: string;
  slug: string;
  variant?: CategoryVariant;
}

// Helper function to get color class from variant for badges/dots (light mode only)
export function getVariantColorClass(variant: CategoryVariant = 'default'): string {
  const colorMap: { [key in CategoryVariant]: string } = {
    'default': 'bg-gray-500',      // #6b7280
    'primary': 'bg-purple-500',    // #8b5cf6
    'success': 'bg-green-500',     // #22c55e
    'danger': 'bg-red-500',        // #ef4444
    'warning': 'bg-blue-500',      // #3b82f6
    'orange': 'bg-orange-500',     // #f97316
    'cyan': 'bg-cyan-500',         // #06b6d4
    'pink': 'bg-pink-500',         // #ec4899
    'indigo': 'bg-indigo-500',     // #6366f1
    'yellow': 'bg-yellow-500'      // #eab308
  };
  
  return colorMap[variant] || colorMap['default'];
}

// Helper function to get event card background colors for week/day views (light backgrounds only)
export function getVariantEventBackgroundClass(variant: CategoryVariant = 'default'): string {
  const colorMap: { [key in CategoryVariant]: string } = {
    'default': 'bg-gray-100 text-gray-800 border-gray-200',      
    'primary': 'bg-purple-100 text-purple-800 border-purple-200',    
    'success': 'bg-green-100 text-green-800 border-green-200',     
    'danger': 'bg-red-100 text-red-800 border-red-200',        
    'warning': 'bg-blue-100 text-blue-800 border-blue-200',       
    'orange': 'bg-orange-100 text-orange-800 border-orange-200',    
    'cyan': 'bg-cyan-100 text-cyan-800 border-cyan-200',        
    'pink': 'bg-pink-100 text-pink-800 border-pink-200',         
    'indigo': 'bg-indigo-100 text-indigo-800 border-indigo-200',    
    'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200'     
  };
  
  return colorMap[variant] || colorMap['default'];
}

// Helper function to get after pseudo-element colors for organization events
export function getVariantAfterColorClass(variant: CategoryVariant = 'default'): string {
  const colorMap: { [key in CategoryVariant]: string } = {
    'default': 'after:bg-gray-500',      
    'primary': 'after:bg-purple-500',    
    'success': 'after:bg-green-500',     
    'danger': 'after:bg-red-500',        
    'warning': 'after:bg-blue-500',       
    'orange': 'after:bg-orange-500',    
    'cyan': 'after:bg-cyan-500',        
    'pink': 'after:bg-pink-500',         
    'indigo': 'after:bg-indigo-500',    
    'yellow': 'after:bg-yellow-500'     
  };
  
  return colorMap[variant] || colorMap['default'];
}

// Helper function to get variant from category slug using custom mappings
export function getCategoryVariant(
  categorySlug: string | null | undefined, 
  categoryMappings: { [slug: string]: CategoryVariant } = {}
): CategoryVariant {
  if (!categorySlug) return 'default';
  
  // Check custom mappings first
  if (categoryMappings[categorySlug]) {
    return categoryMappings[categorySlug];
  }
  
  // Default to gray if no category mapping is found
  return 'default';
}

// Helper function to create category mappings from event categories array
export function createCategoryMappings(eventCategories: EventCategoryInfo[] | undefined): { [slug: string]: CategoryVariant } {
  const mappings: { [slug: string]: CategoryVariant } = {};
  if (!eventCategories || !Array.isArray(eventCategories)) {
    return mappings;
  }
  eventCategories.forEach(category => {
    if (category.variant) {
      mappings[category.slug] = category.variant;
    }
  });
  return mappings;
}