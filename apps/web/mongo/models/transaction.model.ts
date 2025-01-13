import mongoose, { Document, Schema } from "mongoose";
import { UserDocument } from "./user.model";

export interface ITransaction extends Document {
  amount: number;
  status: string;
  paymentId: string;
  orderId: string;
  createdAt: Date;
  event: string;
  user: UserDocument["_id"];
}

const TransactionSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    amount: { type: Number, required: true }, 
    status: {
      type: String,
      enum: ["INITIATED", "SUCCESS", "FAILED"],
      default: "INITIATED",
    },
    paymentId: { type: String },
    orderId: { type: String },
    createdAt: { type: Date, default: Date.now },
    signature: { type: String },
  },
  {
    timestamps: true,
  }
);
const TransactionModel =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default TransactionModel;