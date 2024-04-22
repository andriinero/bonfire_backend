import { Schema, Types, model } from 'mongoose';

export type TChatRoom = {
  _id: Types.ObjectId;
  name: string;
  participants: string[];
  created: Date;
};

const ChatRoomSchema = new Schema<TChatRoom>({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  participants: [{ type: Types.ObjectId, ref: 'User' }],
  created: { type: Date, required: true, default: new Date() },
});

const ChatRoom = model<TChatRoom>('ChatRoom', ChatRoomSchema);

export default ChatRoom;
