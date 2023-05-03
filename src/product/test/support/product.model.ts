import { ProductMongoose, productStub } from '../stubs/product.stub';
import { MockModel } from 'src/database/support/mock.model';

export class ProductModel extends MockModel<ProductMongoose> {
  protected entityStub = productStub();
}
