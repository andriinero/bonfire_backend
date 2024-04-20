import { Schema, Types, model } from 'mongoose';

export type TUserPublic = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: 'user' | 'admin';
  created: Date;
  is_online: boolean;
  profile_image: string;
};

export type TUserPrivate = {
  password: string;
};

export type TUser = TUserPublic & TUserPrivate;

const UserSchema = new Schema<TUser>(
  {
    username: { type: String, required: true, minlength: 3, maxlength: 100 },
    email: { type: String, required: true, minlength: 3, maxlength: 100 },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    created: { type: Date, required: true, default: new Date() },
    is_online: { type: Boolean, required: true, default: false },
    profile_image: { type: String },
  },
  { versionKey: false },
);

const User = model<TUser>('User', UserSchema);

export default User;
