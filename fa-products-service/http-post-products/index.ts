import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Database } from '@azure/cosmos';
import { ProductsService } from '../src/services/products.service';
import { ProductDto } from '../src/dtos/product-dto';
import { CosmosDb } from '../src/cosmos-db/cosmos-db';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const productCandidate: Omit<ProductDto, 'id'> = req.body;

  context.log(
    'HTTP trigger function processed a request with productCandidate',
    productCandidate,
  );

  const db: Database = CosmosDb.connect();

  try {
    const product: ProductDto = await ProductsService.addProduct(
      db,
      productCandidate,
    );
    context.res = {
      body: product,
    };
  } catch (error) {
    context.res = {
      status: 400,
      body: { error: error.message },
    };
  }
};

export default httpTrigger;
