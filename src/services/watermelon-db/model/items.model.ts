import { Model } from '@nozbe/watermelondb';
import { date, text } from '@nozbe/watermelondb/decorators';

class ItemsModel extends Model {
  static table = 'list_item';
  static associations = {
    lists: { type: 'belongs_to' as const, key: 'list_id' },
    user_profile: { type: 'belongs_to' as const, key: 'user_profile_id' },
  };

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @text('title') title!: string;
  @text('price') price!: number;
  @text('is_checked') isChecked!: boolean;
  @text('amount') amount!: number;
}

export default ItemsModel;
