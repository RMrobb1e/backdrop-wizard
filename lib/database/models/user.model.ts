import { Schema, model, models } from "mongoose";

export interface IUser {
  clerkId: string;
  email: string;
  username: string;
  photo: URL;
  firstName: string;
  lastName: string;
  planId: string;
  creditBalance: number;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  photo: { type: URL, required: true },
  firstName: { type: String },
  lastName: { type: String },
  planId: { type: Number, default: 1 },
  creditBalance: { type: Number, default: 10 },
});

const User = models?.user || model("User", UserSchema);

export default User;
