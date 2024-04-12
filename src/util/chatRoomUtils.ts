import { TUser } from '@src/models/User';

export const getChatRoomName = (
  currentUserId: string,
  participants: TUser[],
) => {
  let result = '';
  const count = participants.length;
  const otherParticipantNames = participants
    .filter((p) => p._id.toString() !== currentUserId)
    .map((p) => p.username);

  if (count <= 2) result = otherParticipantNames.pop() ?? 'No participants';
  if (count > 2) result = otherParticipantNames.join(', ');

  return result;
};
