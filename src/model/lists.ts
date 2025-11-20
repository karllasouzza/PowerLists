import { Model } from '@nozbe/watermelondb';
import { date, text } from '@nozbe/watermelondb/decorators';

class List extends Model {
  static table = 'lists';

  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  @text('user_id') userId!: string;
  @text('title') title!: string;
  @text('accent_color') accentColor!: string;
  @text('icon') icon!: string;
}

export default List;
