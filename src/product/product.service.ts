import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product-dto';
import { Product } from './schema/product.schema';
import { UpdateProductDto } from './dto/update-product-dto';
import { RestaurantController } from 'src/restaurant/restaurant.controller';
import * as moment from 'moment';
import { getDaysOfWeek } from 'src/restaurant/dto/helpers/validate-businessHours.helper';
import { InvalidTimeOnSale } from './exceptions/invalid-timeonsale.exception';
import { RestaurantNotFound } from 'src/restaurant/exceptions/restaurant-not-found.exception';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly restaurantController: RestaurantController,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const restaurantId = createProductDto.restaurantId.toString();
    const restaurant = await this.restaurantController.getRestaurant(
      restaurantId,
    );
    if (!restaurant) {
      throw new RestaurantNotFound(restaurantId);
    }

    const { businessHours } = restaurant;
    const { sale } = createProductDto;
    const timeOnSaleArray = sale.map((saleObj) => saleObj.timeOnSale);

    const isTimeOnSaleBusinessHoursCompliant = timeOnSaleArray.map((sale) => {
      const { dayOfWeekEnd, dayOfWeekStart, endTime, startTime } = sale;

      for (const bh of businessHours) {
        const daysOfWeekSale = getDaysOfWeek(dayOfWeekStart, dayOfWeekEnd);
        const daysOfWeekBH = getDaysOfWeek(bh.dayOfWeekStart, bh.dayOfWeekEnd);

        const saleDaysAreValid = daysOfWeekSale.every((day) =>
          daysOfWeekBH.includes(day),
        );

        if (!saleDaysAreValid) {
          return false;
        }

        const format = 'HH:mm';

        const start1 = moment(bh.startTime, format);
        const end1 = moment(bh.endTime, format);
        const start2 = moment(startTime, format);
        const end2 = moment(endTime, format);

        for (const day1 of daysOfWeekSale) {
          for (const day2 of daysOfWeekBH) {
            if (day1 === day2) {
              if (
                start2.isBetween(start1, end1) ||
                end2.isBetween(start1, end1)
              ) {
                return true;
              }
              if (start2.isSame(start1) && end2.isSame(end1)) {
                return true;
              }
            }
          }
        }
      }
      return false;
    });

    if (isTimeOnSaleBusinessHoursCompliant.includes(false)) {
      throw new InvalidTimeOnSale(
        'TimeOnSale is not compliant with business hours of the product!',
      );
    }

    return this.productRepository.create(createProductDto);
  }

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find({});
  }

  async getProductById(id: string): Promise<Product> {
    return await this.productRepository.findOne({ _id: id });
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productRepository.findOneAndUpdate(
      { _id: id },
      updateProductDto,
    );
  }

  async deleteProductById(id: string): Promise<Product> {
    return this.productRepository.findOneAndRemove({ _id: id });
  }
}
