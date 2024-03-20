"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import Transaction from "../database/models/transaction.model";
import { updateCredits } from "./user.actions";

export const checkoutCredits = async (
  transaction: CheckoutTransactionParams,
) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: transaction.plan,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  });

  redirect(session.url!);
};

export const createTransaction = async (
  transaction: CreateTransactionParams,
) => {
  try {
    await connectToDatabase();

    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    await updateCredits(transaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
};
