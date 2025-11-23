export type ProfileType = {
  id?: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type CreateProfileType = Omit<ProfileType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProfileType = Omit<ProfileType, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
