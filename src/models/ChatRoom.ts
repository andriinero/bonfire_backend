import { Schema, Types, model } from 'mongoose';
import { TUser } from './User';

export type TChatRoom = {
  _id: Types.ObjectId;
  name: string;
  participants: TUser;
  created: Date;
};

const ChatRoomSchema = new Schema<TChatRoom>({
  name: { type: String, required: true, minlength: 3, maxlength: 8 },
  participants: [{ type: Types.ObjectId, ref: 'User' }],
  created: { type: Date, required: true, default: new Date() },
});

const ChatRoom = model<TChatRoom>('ChatRoom', ChatRoomSchema);

export default ChatRoom;
