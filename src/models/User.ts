import { Schema, model } from 'mongoose';

import { ColorClass } from '@src/constants/misc';

import type { Document, Types } from 'mongoose';

export type TUserSchema = {
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

export type TUserSchemaDocument = Document<unknown, unknown, TUserSchema> &
  TUserSchema;

const UserSchema = new Schema<TUserSchema>(
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

const User = model<TUserSchema>('User', UserSchema);

export default User;
