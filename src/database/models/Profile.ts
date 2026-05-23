import { Model, Query } from '@nozbe/watermelondb';
import { date, field, readonly, text, children } from '@nozbe/watermelondb/decorators';

import { List } from './List';

export class Profile extends Model {
  static table = 'profiles';
  static associations = {
    lists: { type: 'has_many' as const, foreignKey: 'profile_id' },
  };

  @text('name') name!: string;
  @field('user_id') userId!: string;
  @field('avatar_url') avatarUrl!: string | null;
  @field('bio') bio!: string | null;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @field('deleted_at') deletedAt!: number | null;
  @children('lists') lists!: Query<List>;
}
