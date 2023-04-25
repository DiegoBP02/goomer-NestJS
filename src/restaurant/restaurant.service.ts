import { Injectable } from '@nestjs/common';
import { RestaurantRepository } from './restaurant.repository';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './schema/restaurant.schema';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantRepository.create(createRestaurantDto);
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({});
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    return this.restaurantRepository.findOne({ _id: id });
  }

  async updateRestaurant(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantRepository.findOneAndUpdate(
      { _id: id },
      updateRestaurantDto,
    );
  }

  async deleteRestaurantById(id: string): Promise<Restaurant> {
    return this.restaurantRepository.findOneAndRemove({ _id: id });
  }
}
