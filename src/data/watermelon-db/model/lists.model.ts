import { Collection, Model } from '@nozbe/watermelondb';
import { children, date, field, readonly } from '@nozbe/watermelondb/decorators';
import ListItem from './list_items.model';

class List extends Model {
  static table = 'lists';
  static associations = {
    items: { type: 'has_many' as const, foreignKey: 'list_id' },
    profiles: { type: 'belongs_to' as const, key: 'profile_id' },
  };

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
  @date('deleted_at') deletedAt?: Date;

  @readonly @field('profile_id') profileId!: string;

  @field('title') title!: string;
  @field('accent_color') accentColor!: string;
  @field('icon') icon!: string;

  @children('items') items!: Collection<ListItem>;
}

export default List;
