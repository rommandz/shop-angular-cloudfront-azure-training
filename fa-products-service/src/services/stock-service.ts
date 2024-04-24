import { Database, SqlQuerySpec } from '@azure/cosmos';
import { CosmosDb } from '../cosmos-db/cosmos-db';
import { Stock } from '../models/stock';

export class StockService {
  public static async getStockByProductId(
    db: Database,
    productId: string,
  ): Promise<Stock> {
    const querySpec: SqlQuerySpec = {
      query: 'SELECT * FROM c WHERE c.product_id=@productId',
      parameters: [{ name: '@productId', value: productId }],
    };

    const item = await db
      .container(CosmosDb.STOCK_CONTAINER)
      .items.query(querySpec)
      .fetchAll();

    return item.resources[0];
  }
}
