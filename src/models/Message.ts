import { ObjectId, Schema, Types, model } from 'mongoose';

export type TMessage = {
  _id: Types.ObjectId;
  chat_room: ObjectId;
  user: ObjectId;
  body: string;
  created: Date;
  reply: ObjectId;
};

const MessageSchema = new Schema<TMessage>({
  chat_room: { type: Types.ObjectId, required: true, ref: 'ChatRoom' },
  user: { type: Types.ObjectId, required: true, ref: 'User' },
  body: { type: String, required: true },
  created: { type: Date, required: true, default: new Date() },
  reply: { type: Types.ObjectId, ref: 'Message' },
});

const Message = model<TMessage>('Message', MessageSchema);

export default Message;
