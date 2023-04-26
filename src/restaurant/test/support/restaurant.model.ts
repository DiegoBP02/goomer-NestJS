import { RestaurantMongoose, restaurantStub } from '../stubs/restaurant.stub';
import { MockModel } from 'src/database/support/mock.model';

export class RestaurantModel extends MockModel<RestaurantMongoose> {
  protected entityStub = restaurantStub();
}
