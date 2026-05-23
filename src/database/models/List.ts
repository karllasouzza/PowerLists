import { Model, Query } from '@nozbe/watermelondb';
import { date, field, readonly, text, children, relation } from '@nozbe/watermelondb/decorators';

import { Profile } from './Profile';
import { ListItem } from './ListItem';

export class List extends Model {
  static table = 'lists';
  static associations = {
    list_items: { type: 'has_many' as const, foreignKey: 'list_id' },
  };

  @text('title') title!: string;
  @field('profile_id') profileId!: string;
  @field('accent_color') accentColor!: string;
  @field('icon') icon!: string;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @field('deleted_at') deletedAt!: number | null;
  @relation('profiles', 'profile_id') profile!: Profile;
  @children('list_items') listItems!: Query<ListItem>;
}
