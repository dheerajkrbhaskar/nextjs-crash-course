import { Book } from 'lucide-react';
import { Schema, model, models, Document, Types } from 'mongoose'

export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
        email: {
            type: String, required: [true, 'Email is required'], trim: true, lowercase: true,
            validate: {
                validator: function (email: string) {
                    //RFC 5322 compliant email validation regex
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    return emailRegex.test(email);
                },
                message: 'Please enter a valid email address'
            },
        },
    },
    {
        timestamps: true, //auto generate createdAt and updatedAt fields
    }
);

//Presave hook to validate events exists before creating a booking
BookingSchema.pre('save', async function (next) {
    const booking = this as IBooking;
    
    //only validate if eventId if its new or modified
    if(booking.isModified('eventId') || booking.isNew) {
        try{
            const eventExists = await Event.findById(booking.eventId).select('_id');
            if(!eventExists) {
                const error = new Error(`Event with id ${booking.eventId} does not exist`);
                error.name = 'ValidationError';
                return next(error);
            }
        } catch (err) {
            const validationError = new Error(`Invalid eventsID format or database error`);
            validationError.name = 'ValidationError';
            return next(validationError);
        }
    }
    next();
});

//create index on eventId for faster quries
BookingSchema.index({ eventId: 1 });
//create compound index for common queries (events bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });
//create index on email for user booking lookups
BookingSchema.index({ email: 1 });

BookingSchema.index({ eventId: 1, email: 1 }, { unique: true , name: 'unique_event_email' }); //prevent duplicate bookings for same event and email
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);
export default Booking;