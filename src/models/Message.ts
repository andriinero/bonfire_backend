import { Schema, Types, model } from 'mongoose';

export type TMessage = {
  _id: Types.ObjectId;
  chat_room: Types.ObjectId;
  user: Types.ObjectId;
  body: string;
  created: Date;
  reply: Types.ObjectId;
  type: 'action' | 'message';
};

const MessageSchema = new Schema<TMessage>({
  chat_room: { type: Schema.Types.ObjectId, required: true, ref: 'ChatRoom' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  body: { type: String, required: true },
  created: { type: Date, required: true, default: new Date() },
  reply: { type: Schema.Types.ObjectId, ref: 'Message' },
  type: {
    type: String,
    enum: ['action', 'message'],
    required: true,
    default: 'message',
  },
});

const Message = model<TMessage>('Message', MessageSchema);

export default Message;
