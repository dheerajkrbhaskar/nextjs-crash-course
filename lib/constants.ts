export type EventItem = {
    image: string;
    title: string;
    slug: string;
    location: string;
    date: string; // e.g. "01-12-2025"
    time: string; // e.g. "09:00 AM"
}

export const events: EventItem[] = [
    {
        image: "/images/event1.png",
        title: "React Summit US 2025",
        slug: "react-summit-us-2025",
        location: "San Francisco, CA, USA",
        date: "01-12-2025",
        time: "09:00 AM"
    },
    {
        image: "/images/event2.png",
        title: "Next.js Global Conference",
        slug: "nextjs-global-conference-2025",
        location: "New York City, NY, USA",
        date: "15-02-2025",
        time: "10:00 AM"
    },
    {
        image: "/images/event3.png",
        title: "AI & Web Engineering Expo",
        slug: "ai-web-engineering-expo-2025",
        location: "Berlin, Germany",
        date: "10-03-2025",
        time: "09:30 AM"
    },
    {
        image: "/images/event4.png",
        title: "Full Stack Dev Con",
        slug: "full-stack-dev-con-2025",
        location: "Toronto, ON, Canada",
        date: "22-04-2025",
        time: "11:00 AM"
    },
    {
        image: "/images/event5.png",
        title: "Open Source World Summit",
        slug: "open-source-world-summit-2025",
        location: "Bangalore, India",
        date: "05-06-2025",
        time: "09:00 AM"
    },
    {
        image: "/images/event6.png",
        title: "Cloud Native Engineering Day",
        slug: "cloud-native-engineering-day-2025",
        location: "Singapore",
        date: "18-07-2025",
        time: "10:30 AM"
    }
]