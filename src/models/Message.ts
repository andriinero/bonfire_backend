import { Document, Schema, Types, model } from 'mongoose';

export enum MessageType {
  ACTION = 'action',
  MESSAGE = 'message',
}

export type TMessage = {
  _id: Types.ObjectId;
  chat_room: Types.ObjectId;
  user: Types.ObjectId;
  body: string;
  created: Date;
  reply: Types.ObjectId;
  type: MessageType;
};

export type TMessageDocument = Document<unknown, unknown, TMessage> & TMessage;

const MessageSchema = new Schema<TMessage>({
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

const Message = model<TMessage>('Message', MessageSchema);

export default Message;
