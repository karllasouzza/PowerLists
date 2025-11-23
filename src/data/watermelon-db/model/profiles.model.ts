import { Model } from '@nozbe/watermelondb';
import { date, readonly, field } from '@nozbe/watermelondb/decorators';

class Profile extends Model {
  static table = 'profiles';
  static associations = {
    lists: { type: 'has_many' as const, foreignKey: 'profile_id' },
    items: { type: 'has_many' as const, foreignKey: 'profile_id' },
  };

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @field('user_id') userId!: string;
  @field('name') name!: string;
  @field('avatar_url') avatarUrl!: string;
  @field('bio') bio?: string;
}

export default Profile;
