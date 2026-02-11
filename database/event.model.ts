
import { Schema, model, models, Document } from "mongoose";

//typescript interface for the event document
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
const EventSchema = new Schema<IEvent>({
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: [100, 'Title cannot exceed 100 characters'] },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: [1000, 'Description cannot exceed 1000 characters'] },
    overview: { type: String, required: [true, 'Overview is required'], trim: true, maxlength: [500, 'Overview cannot exceed 500 characters'] },
    image: { type: String, required: [true, 'Image URL is required'], trim: true },
    venue: { type: String, required: [true, 'Venue is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    date: { type: String, required: [true, 'Date is required'], trim: true },
    time: { type: String, required: [true, 'Time is required'], trim: true },
    mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], required: [true, 'Mode is required'] },
    audience: { type: String, required: [true, 'Audience is required'], trim: true },
    agenda: {
        type: [String], required: [true, 'Agenda is required'], validate: {
            validator: (v: string[]) => v.length > 0,
            message: 'At least one agenda item is required'
        }
    },
    organizer: { type: String, required: [true, 'Organizer is required'], trim: true },
    tags: {
        type: [String], required: [true, 'Tags are required'], validate: {
            validator: (v: string[]) => v.length > 0,
            message: 'At least one tag is required'
        }
    },
}, {
    timestamps: true, //auto generate createdAt and updatedAt fields
});

//PRESAVE HOOK TO GENERATE SLUG FROM TITLE and data normalization
EventSchema.pre('save', function (next) {
    const event = this as IEvent;

    //generate slug from title changed or document is new  
    if (event.isModified('title') || event.isNew) {
        event.slug = generateSlug(event.title);
    }

    //normalise tags to ISO format if its not already in that format
    if (event.isModified('date')) {
        event.date = normaliseDate(event.date);
    }
    //normalise time to HH:MM format
    if (event.isModified('time')) {
        event.time = normaliseTime(event.time);
    }
    next();
});


//Helper function to generate URL-friendly slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

//Helper function to normalise date to ISO format
function normaliseDate(date: string): string {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
    }
    return parsedDate.toISOString().split('T')[0]; // Return only the date part in YYYY-MM-DD format
}

//Helper function to normalise time to HH:MM format
function normaliseTime(time: string): string {
    //handles various time formats like 2:30 PM, 14:30, 2 PM etc
    const timeRegex = /^(1[0-2]|0?[1-9]):?([0-5][0-9])?\s?(AM|PM)?$/i;
    const match = time.match(timeRegex);
    if (!match) {
        throw new Error('Invalid time format');
    }
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const ampm = match[3] ? match[3].toUpperCase() : null;

    if (ampm === 'PM' && hours < 12) {
        hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}   

//create unique index on slug field to enforce uniqueness at the database level
EventSchema.index({ slug: 1 }, { unique: true });
//create compound index for common queries
EventSchema.index({ date: 1, mode: 1 });
const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;