import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, text, relation } from '@nozbe/watermelondb/decorators';

import { List } from './List';

export class ListItem extends Model {
  static table = 'list_items';

  @text('title') title!: string | null;
  @field('profile_id') profileId!: string;
  @field('list_id') listId!: string;
  @field('price') price!: number | null;
  @field('amount') amount!: number | null;
  @field('is_checked') isChecked!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @field('deleted_at') deletedAt!: number | null;
  @relation('lists', 'list_id') list!: List;
}
