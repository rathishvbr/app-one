import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class SongModel extends Model {
  @attr('string') title;
  @attr('string') year;
  @attr('string') author;
}
