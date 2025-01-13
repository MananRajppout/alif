import mongoose, { Document, Schema } from "mongoose";
import { IEvent } from "./event.model";
import { UserDocument } from "./user.model";

export interface IOpportunity extends Document {
    event_id: IEvent["_id"];
    user: UserDocument["_id"];
    name: string;
    description: string;
    role: string;
}

const OpporunitySchema: Schema = new Schema(
  {
    event_id: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: false,
    },
    participants: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            status: {
                type: String,
                enum: ["pending", "accepted", "rejected"],
                default: "pending",
            },
        },
    ],
    rounds: [
        {
            type: Schema.Types.ObjectId,
            ref: "Round",
        },
    ],
  },
  {
    timestamps: true,
  }
);

const OpportunityModel =
  mongoose.models.Opportunity || mongoose.model<IOpportunity>("Opportunity", OpporunitySchema);
export default OpportunityModel;
