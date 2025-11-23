import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

class ListItem extends Model {
  static table = 'list_items';
  static associations = {
    lists: { type: 'belongs_to' as const, key: 'list_id' },
    profiles: { type: 'belongs_to' as const, key: 'profile_id' },
  };

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @date('deleted_at') deletedAt?: Date;

  @field('profile_id') profileId!: string;
  @field('list_id') listId!: string;

  @field('title') title!: string;
  @field('price') price!: number;
  @field('amount') amount!: number;
  @field('is_checked') isChecked!: boolean;
}

export default ListItem;
