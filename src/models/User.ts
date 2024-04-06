import { Schema, Types, model } from 'mongoose';

export type TUser = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  created: Date;
  isOnline: boolean;
};

export type TUserMutable = {
  username?: string;
  email?: string;
  password?: string;
};

const UserSchema = new Schema<TUser>({
  username: { type: String, required: true, minlength: 3, maxlength: 100 },
  email: { type: String, required: true, minlength: 3, maxlength: 100 },
  password: { type: String, required: true, minlength: 8 },
  created: { type: Date, required: true, default: new Date() },
  isOnline: { type: Boolean, required: true, default: false },
});

const User = model<TUser>('User', UserSchema);

export default User;
