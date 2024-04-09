import ChatRoom, {
  TChatRoom,
  TChatRoomMutable,
  TChatRoomPost,
} from '@src/models/ChatRoom';

const getAll = async (query: object): Promise<TChatRoom[]> => {
  const allChatRooms = await ChatRoom.find(query).exec();

  return allChatRooms;
};

const getOne = async (query: object) => {
  const chatRoom = await ChatRoom.findOne(query).exec();

  return chatRoom;
};

const createOne = async (data: TChatRoomPost): Promise<void> => {
  const newChatRoom = new ChatRoom(data);
  await newChatRoom.save();
};

const updateOne = async (
  query: object,
  data: TChatRoomMutable,
): Promise<void> => {
  await ChatRoom.findOneAndUpdate(query, data, {
    runValidators: true,
    new: true,
  }).exec();
};

const persists = async (query: object): Promise<boolean> => {
  const persistingChatRoom = await ChatRoom.findOne(query).exec();

  return !!persistingChatRoom;
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  persists,
};
