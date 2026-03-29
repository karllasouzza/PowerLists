/**
 * Profile type matching the database schema:
 * - id: uuid (primary key)
 * - user_id: uuid (unique, references auth.users)
 * - name: text (required)
 * - avatar_url: text (nullable)
 * - bio: text (nullable)
 * - created_at: timestamp with time zone
 * - updated_at: timestamp with time zone (nullable)
 */
export type ProfileType = {
  id: string;
  userId: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
};

export type CreateProfileType = Omit<ProfileType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProfileType = Partial<
  Omit<ProfileType, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>;

export type DeleteProfileType = {
  id: string;
};
