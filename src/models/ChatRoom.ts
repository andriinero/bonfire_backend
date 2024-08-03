import { model, Schema } from 'mongoose';

import { ColorClass } from '@src/constants/misc';

import type { Types } from 'mongoose';

export type TChatRoomSchema = {
  _id: Types.ObjectId;
  name?: string;
  participants: Types.ObjectId[];
  created: Date;
  color_class: ColorClass;
};

const ChatRoomSchema = new Schema<TChatRoomSchema>({
  name: { type: String, minlength: 3, maxlength: 100 },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created: { type: Date, required: true, default: new Date() },
  color_class: {
    type: String,
    required: true,
    enum: Object.values(ColorClass),
  },
});

const ChatRoom = model<TChatRoomSchema>('ChatRoom', ChatRoomSchema);

export default ChatRoom;
