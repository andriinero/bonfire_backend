import { ColorClass } from '@src/constants/misc';
import { Document, Schema, Types, model } from 'mongoose';

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
  color_class: ColorClass;
};

export type TUserDocument = Document<unknown, unknown, TUser> & TUser;

export type TUserPublic = Omit<TUser, 'password'>;

export type TUserPublicDocument = Document<unknown, unknown, TUserPublic> &
  TUserPublic;

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
    color_class: {
      type: String,
      required: true,
      enum: Object.values(ColorClass),
    },
  },
  { versionKey: false },
);

const User = model<TUser>('User', UserSchema);

export default User;
