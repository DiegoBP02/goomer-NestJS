import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './schema/restaurant.schema';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @Get()
  async getRestaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getRestaurants();
  }

  @Get('/:id')
  async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.getRestaurantById(id);
  }

  @Patch('/:id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantService.updateRestaurant(id, updateRestaurantDto);
  }

  @Delete('/:id')
  async deleteRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.deleteRestaurantById(id);
  }
}
