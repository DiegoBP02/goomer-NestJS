import { Types } from 'mongoose';
import { Category, Product } from 'src/product/schema/product.schema';

export interface ProductMongoose extends Product {
  _id: string;
  __v: number;
}

export const productStub = (): ProductMongoose => {
  return {
    _id: '64527aa4b24c1d81517c3d35',
    __v: 0,
    image: 'https://example.com/image.jpg',
    name: 'Grilled Salmon',
    price: 25.99,
    category: Category.Entrees,
    sale: [
      {
        description: '20% off on Tuesdays',
        promotionalPrice: 20.79,
        timeOnSale: {
          dayOfWeekStart: 'Monday',
          dayOfWeekEnd: 'Thursday',
          startTime: '06:00',
          endTime: '15:00',
        },
      },
    ],
    restaurantId: new Types.ObjectId('64527a9cb24c1d81517c3d32'),
  };
};
