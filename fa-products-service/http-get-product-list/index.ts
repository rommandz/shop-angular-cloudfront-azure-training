import { AzureFunction, Context } from '@azure/functions';
import { CosmosDb } from '../src/cosmos-db/cosmos-db';
import { Database } from '@azure/cosmos';
import { ProductsService } from '../src/services/products.service';
import { ProductDto } from '../src/dtos/product-dto';

const httpTrigger: AzureFunction = async function (
  context: Context,
): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const db: Database = CosmosDb.connect();

  const response: ProductDto[] = await ProductsService.getProducts(db);

  context.res = {
    body: {
      data: response,
    },
  };
};

export default httpTrigger;
