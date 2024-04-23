import { Database, FeedResponse } from '@azure/cosmos';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../models/product';
import { StockService } from './stock-service';
import { CosmosDb } from '../cosmos-db/cosmos-db';
import { ProductDto } from '../dtos/product-dto';
import { Stock } from '../models/stock';

export class ProductsService {
  public static readonly newProductValidationSchema = z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      price: z.number().min(1),
      count: z.number().min(1),
    })
    .required();

  public static async getProducts(db: Database): Promise<ProductDto[]> {
    const response: FeedResponse<Product> = await db
      .container(CosmosDb.PRODUCT_CONTAINER)
      .items.query(`SELECT * FROM c`)
      .fetchAll();

    return Promise.all(
      response.resources.map(async (product) => {
        const stock = await StockService.getStockByProductId(db, product.id);

        return new ProductDto(product, stock);
      }),
    );
  }

  public static async getProductById(
    db: Database,
    id: string,
  ): Promise<ProductDto> {
    const product = (
      await db.container(CosmosDb.PRODUCT_CONTAINER).item(id, id).read()
    ).resource;
    if (!product) {
      return null;
    }
    const stock = await StockService.getStockByProductId(db, id);

    return new ProductDto(product, stock);
  }

  public static async getProductsTotalNumber(db: Database): Promise<number> {
    const response: FeedResponse<number> = await db
      .container(CosmosDb.PRODUCT_CONTAINER)
      .items.query(`SELECT VALUE COUNT(c.id) FROM c`)
      .fetchAll();

    return response.resources[0];
  }

  public static async addProduct(
    db: Database,
    productCandidate: Omit<ProductDto, 'id'>,
  ): Promise<ProductDto> {
    const { success, error } =
      ProductsService.validateNewProduct(productCandidate);

    if (!success) {
      throw new Error(error.toString());
    }

    const newProduct: Product = {
      id: uuidv4(),
      title: productCandidate.title,
      description: productCandidate.description,
      price: productCandidate.price,
    };

    const newStock: Stock = {
      product_id: newProduct.id,
      count: productCandidate.count,
    };

    const [savedProduct, savedStock] = await Promise.all([
      (
        await db
          .container(CosmosDb.PRODUCT_CONTAINER)
          .items.upsert<Product>(newProduct)
      ).resource,
      (
        await db
          .container(CosmosDb.STOCK_CONTAINER)
          .items.upsert<Stock>(newStock)
      ).resource,
    ]);

    return new ProductDto(savedProduct, savedStock);
  }

  public static validateNewProduct(product: Omit<ProductDto, 'id'>) {
    return ProductsService.newProductValidationSchema.safeParse(product);
  }
}
