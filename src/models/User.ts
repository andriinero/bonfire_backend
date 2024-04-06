import { Schema, Types, model } from 'mongoose';

export type TUser = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  created: Date;
  isOnline: boolean;
};

const UserSchema = new Schema<TUser>({
  username: { type: String, required: true, minlength: 3, maxlength: 100 },
  email: { type: String, required: true, minlength: 3, maxlength: 100 },
  created: { type: Date, required: true },
  isOnline: { type: Boolean, required: true, default: false },
});

const User = model<TUser>('User', UserSchema);

export default User;
