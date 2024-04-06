import { Schema, Types, model } from 'mongoose';

export type TUser = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created: Date;
  isOnline: boolean;
};

export type TUserMutable = {
  username?: string;
  email?: string;
  password?: string;
};

export type AuthPayload = {
  sub: string;
  username: string;
  role: string;
};

const UserSchema = new Schema<TUser>(
  {
    username: { type: String, required: true, minlength: 3, maxlength: 100 },
    email: { type: String, required: true, minlength: 3, maxlength: 100 },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    created: { type: Date, required: true, default: new Date() },
    isOnline: { type: Boolean, required: true, default: false },
  },
  { versionKey: false },
);

const User = model<TUser>('User', UserSchema);

export default User;
