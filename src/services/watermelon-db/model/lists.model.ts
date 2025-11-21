import { Collection, Model } from '@nozbe/watermelondb';
import { children, date, text } from '@nozbe/watermelondb/decorators';
import ListItemsModel from './items.model';

class ListsModel extends Model {
  static table = 'lists';
  static associations = {
    items: { type: 'has_many' as const, foreignKey: 'list_id' },
  };

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @text('user_id') userId!: string;
  @text('title') title!: string;
  @text('accent_color') accentColor!: string;
  @text('icon') icon!: string;

  @children('items') items!: Collection<ListItemsModel>;
}

export default ListsModel;
