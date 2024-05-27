import { Document, Schema, Types, model } from 'mongoose';

export type TChatRoom = {
  _id: Types.ObjectId;
  name?: string;
  participants: Types.ObjectId[];
  created: Date;
};

export type TChatRoomDocument = Document<unknown, unknown, TChatRoom> &
  TChatRoom;

const ChatRoomSchema = new Schema<TChatRoom>({
  name: { type: String, minlength: 3, maxlength: 100 },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  created: { type: Date, required: true, default: new Date() },
});

const ChatRoom = model<TChatRoom>('ChatRoom', ChatRoomSchema);

export default ChatRoom;
