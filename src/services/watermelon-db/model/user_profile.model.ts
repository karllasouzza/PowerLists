import { Model } from '@nozbe/watermelondb';
import { date, text } from '@nozbe/watermelondb/decorators';

class UserProfileModel extends Model {
  static table = 'user_profile';
  static associations = {
    lists: { type: 'has_many' as const, foreignKey: 'user_profile_id' },
    items: { type: 'has_many' as const, foreignKey: 'user_profile_id' },
  };

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @text('name') name!: string;
  @text('email') email!: string;
  @text('avatar') avatar!: string;
  @text('bio') bio!: string;
}

export default UserProfileModel;
