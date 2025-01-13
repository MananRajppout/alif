import mongoose, { Document, Schema } from "mongoose";
import { UserDocument } from "./user.model";

export interface IEvent extends Document {
  name: string;
  date: Date;
  speakers: Number;
  location: string;
  city: string;
  state: string;
  country: string;
  about: string;
  bulletPoints: [string];
  coverImage: string;
  displayImage: string;
  numberOfSeats: number;
  user: UserDocument["_id"];
}

const EventSchema: Schema = new Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    speakers: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    numberOfSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    about: {
      type: String,
    },
    bulletPoints: {
      type: [String],
    },
    coverImage: {
      type: String,
    },
    displayImage: {
      type: String,
    },
    status: {
      isPublished: {
        type: Boolean,
        default: true,
      },
      isApproved: {
        type: Boolean,
        default: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    usersRegistered: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now(),
        },
        resume: {
          type: Schema.Types.ObjectId,
          ref: "Resume",
        },
      },
    ],
    companiesRegistered: [
      {
        name:{
          type: String,
          require:true,
        },
        email:{      
          type: String,
          require:true,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        company: {
          type: Schema.Types.ObjectId,
          ref: "Company",
        },
        date: {
          type: Date,
          default: Date.now(),
        },
        jobs: [
          {
            type: Schema.Types.ObjectId,
            ref: "Job",
          },
        ],
      },
    ],
    opportunities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Opportunity",
      },
    ],
    ratingsNumber:{
      type: Number,
      default: 0,
    },
    ratingsUsers:{
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const EventModel =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default EventModel;
