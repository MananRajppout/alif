import mongoose, { Document, Schema } from "mongoose";
import { IEvent } from "./event.model";
import { IOpportunity } from "./opportunity.model";

export interface IRound extends Document {
    event_id: IEvent["_id"];
    opportunity_id: IOpportunity["_id"];
    name: string;
    description: string;
    roundType: string;
    rooms: [
        {
            _id: Schema.Types.ObjectId;
            interviewer: {
                name: string;
                email: string;
            },
        }
    ];
}

const RoundSchema: Schema = new Schema(
  {
    event_id: {
        type: Schema.Types.ObjectId,
        ref: "Event",
    },
    opportunity_id: {
        type: Schema.Types.ObjectId,
        ref: "Opportunity",
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    roundType: {
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    rooms: [
        {
            interviewerName: {type: String},
            interviewerEmail: {type: String},
            accessToken: {type: String, select: false}
        }
    ],
  },
  {
    timestamps: true,
  }
);

const RoundModel =
  mongoose.models.Round || mongoose.model<IRound>("Round", RoundSchema);
export default RoundModel;
