import { CosmosClient, Database } from '@azure/cosmos';

export class CosmosDb {
  public static readonly DATABASE_NAME: string = 'products-db';
  public static readonly PRODUCT_CONTAINER: string = 'products';
  public static readonly STOCK_CONTAINER: string = 'stock';

  public static connect(): Database {
    try {
      const cosmosClient: CosmosClient = new CosmosClient(
        process.env.CosmosDbConnectionString,
      );

      return cosmosClient.database(CosmosDb.DATABASE_NAME);
    } catch (e) {
      console.error('Connection Failed', e);
    }
  }
}
