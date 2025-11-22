import { Model } from '@nozbe/watermelondb';
import { date, field } from '@nozbe/watermelondb/decorators';

class ListItem extends Model {
  static table = 'list_items';
  static associations = {
    lists: { type: 'belongs_to' as const, key: 'list_id', indexedDB: true },
    profiles: { type: 'belongs_to' as const, key: 'profile_id', indexedDB: true },
  };

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @field('profile_id') profileId!: string;
  @field('list_id') listId!: string;

  @field('title') title!: string;
  @field('price') price!: number;
  @field('amount') amount!: number;
  @field('is_checked') isChecked!: boolean;
}

export default ListItem;
