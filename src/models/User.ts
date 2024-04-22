import { Schema, Types, model } from 'mongoose';

export type TUser = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created: Date;
  is_online: boolean;
  profile_image: string;
};

export type TUserPublic = Omit<TUser, 'password'>;

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
