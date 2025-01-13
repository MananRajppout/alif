import TransactionModel from "../models/transaction.model";
import UserModel from "../models/user.model";

export async function createTransaction( data: any) {
  try {

    const transaction = await TransactionModel.create({
      user: data.user,
      event: data.event,
      amount: data.amount,
      status: "INITIATED",
      paymentId: data.paymentId,
      orderId: data.order_id,
    })

    

    return transaction;
    
  } catch (e) {
    throw e;
  }
}

export async function verifyTransaction( data: any) {
  try {
    

  } catch (e) {
    throw e;
  }
}