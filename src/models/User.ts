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
  contacts: Types.ObjectId[];
};

export type TUserPublic = Omit<TUser, 'password'>;

export const USER_DATA_SELECTION = '-password';

const UserSchema = new Schema<TUser>(
  {
    username: { type: String, required: true, minlength: 3, maxlength: 100 },
    email: { type: String, required: true, minlength: 3, maxlength: 100 },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    created: { type: Date, required: true, default: new Date() },
    is_online: { type: Boolean, required: true, default: false },
    profile_image: { type: String },
    contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { versionKey: false },
);

const User = model<TUser>('User', UserSchema);

export default User;
