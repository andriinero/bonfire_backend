import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { authenticate } from '@src/middlewares/authentication';
import ProfileService from '@src/services/ProfileService';
import { validate } from '@src/util/validationUtils';
import asyncHandler from 'express-async-handler';
import { ProfilePatch, profilePatchSchema } from '../schemas/ProfileSchemas';
import { Req } from '../types/types';

const patch = [
  authenticate,
  validate(profilePatchSchema),
  asyncHandler(async (req: Req<ProfilePatch>, res) => {
    const userId = req.user!.id;
    const { firstName, lastName, username, email, bio, location } = req.body;
    const profilePatchData = {
      firstName,
      lastName,
      username,
      email,
      bio,
      location,
    };

    await ProfileService.patchProfileByUserId(userId, profilePatchData);

    res
      .status(HttpStatusCodes.OK)
      .json({ message: 'Profile updated successfully' });
  }),
];

export default {
  patch,
} as const;
