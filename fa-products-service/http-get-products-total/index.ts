import { AzureFunction, Context } from '@azure/functions';
import { Database } from '@azure/cosmos';
import { CosmosDb } from '../src/cosmos-db/cosmos-db';
import { ProductsService } from '../src/services/products.service';

const httpTrigger: AzureFunction = async function (
  context: Context,
): Promise<void> {
  context.log('HTTP trigger function processed a request.');

  const db: Database = CosmosDb.connect();
  const data: number = await ProductsService.getProductsTotalNumber(db);

  context.res = {
    body: { data },
  };
};

export default httpTrigger;
