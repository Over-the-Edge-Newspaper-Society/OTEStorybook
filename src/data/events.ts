import type { Event, EventMetadata } from "@/types";

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

export const unbcEvents: Event[] = [
  {
    id: "1",
    title: "Indigenous Culture Workshop",
    description: "Learn about local Indigenous traditions and participate in hands-on cultural activities led by community elders.",
    content: "Learn about local Indigenous traditions and participate in hands-on cultural activities led by community elders.",
    startDate: new Date(currentYear, currentMonth, 15, 14, 0),
    endDate: new Date(currentYear, currentMonth, 15, 16, 0),
    variant: "warning",
    organization_ids: [4], // Cultural Society
    event_categories: [5] // Cultural
  },
  {
    id: "2",
    title: "Career Fair 2025",
    description: "Meet with local employers and explore career opportunities in Northern BC and beyond.",
    content: "Meet with local employers and explore career opportunities in Northern BC and beyond.",
    startDate: new Date(currentYear, currentMonth, 18, 10, 0),
    endDate: new Date(currentYear, currentMonth, 18, 15, 0),
    variant: "success",
    organization_ids: [5], // Career Services
    event_categories: [4] // Workshop
  },
  {
    id: "3",
    title: "Hiking Trip to Tabletop Mountain",
    description: "Join us for a challenging but rewarding day hike to one of the region's most spectacular viewpoints.",
    content: "Join us for a challenging but rewarding day hike to one of the region's most spectacular viewpoints.",
    startDate: new Date(currentYear, currentMonth, 22, 8, 0),
    endDate: new Date(currentYear, currentMonth, 22, 18, 0),
    variant: "danger",
    organization_ids: [3], // Athletics Department
    event_categories: [3] // Sports
  },
  {
    id: "4",
    title: "Mental Health Awareness Week",
    description: "A week-long series of workshops, activities, and resources focused on mental health and wellbeing.",
    content: "A week-long series of workshops, activities, and resources focused on mental health and wellbeing.",
    startDate: new Date(currentYear, currentMonth, 26, 9, 0),
    endDate: new Date(currentYear, currentMonth, 26, 17, 0),
    variant: "warning",
    organization_ids: [1], // Student Union
    event_categories: [4] // Workshop
  },
  {
    id: "5",
    title: "Spring Formal Dance",
    description: "Celebrate the end of the semester with music, dancing, and refreshments in our beautiful Winter Garden.",
    content: "Celebrate the end of the semester with music, dancing, and refreshments in our beautiful Winter Garden.",
    startDate: new Date(currentYear, currentMonth, Math.min(29, new Date(currentYear, currentMonth + 1, 0).getDate()), 19, 0),
    endDate: new Date(currentYear, currentMonth, Math.min(29, new Date(currentYear, currentMonth + 1, 0).getDate()), 23, 0),
    variant: "warning",
    organization_ids: [1], // Student Union
    event_categories: [2] // Social
  },
  {
    id: "6",
    title: "Research Presentation Day",
    description: "Graduate students present their research findings across various disciplines.",
    content: "Graduate students present their research findings across various disciplines.",
    startDate: new Date(currentYear, currentMonth, 12, 13, 0),
    endDate: new Date(currentYear, currentMonth, 12, 17, 0),
    variant: "success",
    organization_ids: [2], // Computer Science Club
    event_categories: [1] // Academic
  },
  {
    id: "7",
    title: "Photography Workshop",
    description: "Learn basic photography techniques and composition.",
    content: "Learn basic photography techniques and composition.",
    startDate: new Date(currentYear, currentMonth, 5, 15, 30),
    endDate: new Date(currentYear, currentMonth, 5, 17, 30),
    variant: "warning",
    organization_ids: [4], // Cultural Society
    event_categories: [4] // Workshop
  },
  {
    id: "8",
    title: "Volunteer Fair",
    description: "Connect with local organizations looking for volunteers.",
    content: "Connect with local organizations looking for volunteers.",
    startDate: new Date(currentYear, currentMonth, 8, 11, 0),
    endDate: new Date(currentYear, currentMonth, 8, 14, 0),
    variant: "default",
    organization_ids: [1], // Student Union
    event_categories: [2] // Social
  },
  {
    id: "9",
    title: "Business Networking Event",
    description: "Network with local business professionals and alumni.",
    content: "Network with local business professionals and alumni.",
    startDate: new Date(currentYear, currentMonth, 20, 18, 0),
    endDate: new Date(currentYear, currentMonth, 20, 20, 0),
    variant: "success",
    organization_ids: [5], // Career Services
    event_categories: [4] // Workshop
  },
  {
    id: "10",
    title: "Stress Relief Workshop",
    description: "Learn effective stress management techniques for exam season.",
    content: "Learn effective stress management techniques for exam season.",
    startDate: new Date(currentYear, currentMonth, 14, 16, 0),
    endDate: new Date(currentYear, currentMonth, 14, 17, 30),
    variant: "warning",
    organization_ids: [1], // Student Union
    event_categories: [4] // Workshop
  },
  {
    id: "11",
    title: "International Food Festival",
    description: "Taste foods from around the world and celebrate cultural diversity.",
    content: "Taste foods from around the world and celebrate cultural diversity.",
    startDate: new Date(currentYear, currentMonth, 25, 12, 0),
    endDate: new Date(currentYear, currentMonth, 25, 16, 0),
    variant: "warning",
    organization_ids: [4], // Cultural Society
    event_categories: [5] // Cultural
  },
  {
    id: "12",
    title: "Campus Soccer Tournament",
    description: "Join teams and compete in our annual soccer tournament.",
    content: "Join teams and compete in our annual soccer tournament.",
    startDate: new Date(currentYear, currentMonth, Math.min(30, new Date(currentYear, currentMonth + 1, 0).getDate()), 9, 0),
    endDate: new Date(currentYear, currentMonth, Math.min(30, new Date(currentYear, currentMonth + 1, 0).getDate()), 17, 0),
    variant: "danger",
    organization_ids: [3], // Athletics Department
    event_categories: [3] // Sports
  },
  {
    id: "13",
    title: "Morning Yoga Session",
    description: "Start your day with a relaxing yoga session.",
    content: "Start your day with a relaxing yoga session.",
    startDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 2), 7, 0),
    endDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 2), 8, 0),
    variant: "warning",
    organization_ids: [1], // Student Union
    event_categories: [4] // Workshop
  },
  {
    id: "14",
    title: "Study Group - Biology 101",
    description: "Group study session for upcoming Biology 101 midterm exam.",
    content: "Group study session for upcoming Biology 101 midterm exam.",
    startDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 1), 10, 0),
    endDate: new Date(currentYear, currentMonth, Math.max(1, today.getDate() - 1), 12, 0),
    variant: "success",
    organization_ids: [2], // Computer Science Club
    event_categories: [1] // Academic
  },
  {
    id: "15",
    title: "Lunch & Learn: Sustainability",
    description: "Learn about campus sustainability initiatives while enjoying lunch.",
    content: "Learn about campus sustainability initiatives while enjoying lunch.",
    startDate: new Date(currentYear, currentMonth, today.getDate(), 12, 0),
    endDate: new Date(currentYear, currentMonth, today.getDate(), 13, 0),
    variant: "success",
    organization_ids: [1], // Student Union
    event_categories: [4] // Workshop
  },
  {
    id: "16",
    title: "Study Session - Math Tutoring",
    description: "Drop-in math tutoring session for students needing extra help.",
    content: "Drop-in math tutoring session for students needing extra help.",
    startDate: new Date(currentYear, currentMonth, Math.min(28, new Date(currentYear, currentMonth + 1, 0).getDate()), 14, 0),
    endDate: new Date(currentYear, currentMonth, Math.min(28, new Date(currentYear, currentMonth + 1, 0).getDate()), 16, 0),
    variant: "default",
    organization_ids: [2], // Computer Science Club
    event_categories: [1] // Academic
  },
  {
    id: "17",
    title: "Campus Walking Group",
    description: "Informal walking group meeting at the main entrance. All fitness levels welcome.",
    content: "Informal walking group meeting at the main entrance. All fitness levels welcome.",
    startDate: new Date(currentYear, currentMonth, Math.min(27, new Date(currentYear, currentMonth + 1, 0).getDate()), 17, 0),
    endDate: new Date(currentYear, currentMonth, Math.min(27, new Date(currentYear, currentMonth + 1, 0).getDate()), 18, 0),
    variant: "warning",
    organization_ids: [3], // Athletics Department
    event_categories: [3] // Sports
  },
  {
    id: "18",
    title: "Free Pizza Friday",
    description: "Free pizza available in the student lounge while supplies last.",
    content: "Free pizza available in the student lounge while supplies last.",
    startDate: new Date(currentYear, currentMonth, Math.min(24, new Date(currentYear, currentMonth + 1, 0).getDate()), 11, 30),
    endDate: new Date(currentYear, currentMonth, Math.min(24, new Date(currentYear, currentMonth + 1, 0).getDate()), 13, 0),
    variant: "success",
    organization_ids: [1], // Student Union
    event_categories: [2] // Social
  },
];

export const eventMetadata: Record<string, EventMetadata> = {
  "1": {
    category: "cultural",
    organization: "Cultural Society",
    location: "Agora",
    cost: "Free",
    registrationRequired: true,
    description: "Learn about local Indigenous traditions and participate in hands-on cultural activities led by community elders.",
    categories: [{ slug: "cultural", name: "Cultural" }]
  },
  "2": {
    category: "workshop",
    organization: "Career Services",
    location: "Campus Gymnasium",
    cost: "Free",
    registrationRequired: false,
    description: "Meet with local employers and explore career opportunities in Northern BC and beyond.",
    categories: [{ slug: "workshop", name: "Workshop" }],
    website: "https://www.unbc.ca/career-services"
  },
  "3": {
    category: "sports",
    organization: "Athletics Department",
    location: "Meet at Student Union Building",
    cost: "$15",
    registrationRequired: true,
    description: "Join us for a challenging but rewarding day hike to one of the region's most spectacular viewpoints.",
    categories: [{ slug: "sports", name: "Sports" }]
  },
  "4": {
    category: "workshop",
    organization: "Student Union",
    location: "Various Locations",
    cost: "Free",
    registrationRequired: false,
    description: "A week-long series of workshops, activities, and resources focused on mental health and wellbeing.",
    categories: [{ slug: "workshop", name: "Workshop" }]
  },
  "5": {
    category: "social",
    organization: "Student Union",
    location: "Winter Garden",
    cost: "$25",
    registrationRequired: true,
    description: "Celebrate the end of the semester with music, dancing, and refreshments in our beautiful Winter Garden.",
    categories: [{ slug: "social", name: "Social" }],
    website: "https://www.unbc.ca/student-life/events"
  },
  "6": {
    category: "academic",
    organization: "Computer Science Club",
    location: "Teaching Laboratory Building",
    cost: "Free",
    registrationRequired: false,
    description: "Graduate students present their research findings across various disciplines.",
    categories: [{ slug: "academic", name: "Academic" }]
  },
  "7": {
    category: "workshop",
    organization: "Cultural Society",
    location: "Art Building Studio 3",
    cost: "$10",
    registrationRequired: true,
    description: "Learn basic photography techniques and composition.",
    categories: [{ slug: "workshop", name: "Workshop" }]
  },
  "8": {
    category: "social",
    organization: "Student Union",
    location: "Student Union Building",
    cost: "Free",
    registrationRequired: false,
    description: "Connect with local organizations looking for volunteers.",
    categories: [{ slug: "social", name: "Social" }]
  },
  "9": {
    category: "workshop",
    organization: "Career Services",
    location: "Winter Garden",
    cost: "$5",
    registrationRequired: true,
    description: "Network with local business professionals and alumni.",
    categories: [{ slug: "workshop", name: "Workshop" }],
    website: "https://www.unbc.ca/business-networking"
  },
  "10": {
    category: "workshop",
    organization: "Student Union",
    location: "Campus Recreation Center",
    cost: "Free",
    registrationRequired: false,
    description: "Learn effective stress management techniques for exam season.",
    categories: [{ slug: "workshop", name: "Workshop" }]
  },
  "11": {
    category: "cultural",
    organization: "Cultural Society",
    location: "Agora",
    cost: "Free",
    registrationRequired: false,
    description: "Taste foods from around the world and celebrate cultural diversity.",
    categories: [{ slug: "cultural", name: "Cultural" }]
  },
  "12": {
    category: "sports",
    organization: "Athletics Department",
    location: "Campus Soccer Field",
    cost: "$20 per team",
    registrationRequired: true,
    description: "Join teams and compete in our annual soccer tournament.",
    categories: [{ slug: "sports", name: "Sports" }]
  },
  "13": {
    category: "workshop",
    organization: "Student Union",
    location: "Campus Recreation Center",
    cost: "Free",
    registrationRequired: false,
    description: "Start your day with a relaxing yoga session.",
    categories: [{ slug: "workshop", name: "Workshop" }]
  },
  "14": {
    category: "academic",
    organization: "Computer Science Club",
    location: "Library Study Room 201",
    cost: "Free",
    registrationRequired: false,
    description: "Group study session for upcoming Biology 101 midterm exam.",
    categories: [{ slug: "academic", name: "Academic" }]
  },
  "15": {
    category: "workshop",
    organization: "Student Union",
    location: "Agora",
    cost: "Free",
    registrationRequired: false,
    description: "Learn about campus sustainability initiatives while enjoying lunch.",
    categories: [{ slug: "workshop", name: "Workshop" }]
  },
  "16": {
    category: "academic",
    organization: "Computer Science Club",
    location: "Library Study Room 105",
    cost: "Free",
    registrationRequired: false,
    description: "Drop-in math tutoring session for students needing extra help.",
    categories: [{ slug: "academic", name: "Academic" }]
  },
  "17": {
    category: "sports",
    organization: "Athletics Department",
    location: "Campus Trails",
    cost: "Free",
    registrationRequired: false,
    description: "Informal walking group meeting at the main entrance. All fitness levels welcome.",
    categories: [{ slug: "sports", name: "Sports" }]
  },
  "18": {
    category: "social",
    organization: "Student Union",
    location: "Student Lounge",
    cost: "Free",
    registrationRequired: false,
    description: "Free pizza available in the student lounge while supplies last.",
    categories: [{ slug: "social", name: "Social" }]
  }
};