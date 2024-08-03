import { Schema, model } from 'mongoose';

import type { Types } from 'mongoose';

export enum MessageType {
  ACTION = 'action',
  MESSAGE = 'message',
}

export type TMessageSchema = {
  _id: Types.ObjectId;
  chat_room: Types.ObjectId;
  user: Types.ObjectId;
  body: string;
  created: Date;
  reply: Types.ObjectId;
  type: MessageType;
};

const MessageSchema = new Schema<TMessageSchema>({
  chat_room: { type: Schema.Types.ObjectId, required: true, ref: 'ChatRoom' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  body: { type: String, required: true },
  created: { type: Date, required: true, default: new Date() },
  reply: { type: Schema.Types.ObjectId, ref: 'Message' },
  type: {
    type: String,
    enum: Object.values(MessageType),
    required: true,
    default: MessageType.MESSAGE,
  },
});

const Message = model<TMessageSchema>('Message', MessageSchema);

export default Message;
