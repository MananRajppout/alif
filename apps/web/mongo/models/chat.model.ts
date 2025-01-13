import mongoose from "mongoose";
import { UserDocument } from "./user.model";

interface Message {
  content: string;
  timestamp: Date;
  sender: UserDocument["_id"];
  status: "sent" | "delivered" | "read";
}

export interface ChatDocument extends mongoose.Document {
  participants: [UserDocument["_id"], UserDocument["_id"]];
  messages: Message[];
}

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { _id: false }
); // Disable _id for subdocuments

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [messageSchema],
});

chatSchema.index({ participants: 1 }, { unique: true });

const ChatModel =
  mongoose.models.Chat || mongoose.model<ChatDocument>("Chat", chatSchema);
export default ChatModel;
