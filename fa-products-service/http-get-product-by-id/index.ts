import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Database } from '@azure/cosmos';
import { CosmosDb } from '../src/cosmos-db/cosmos-db';
import { ProductsService } from '../src/services/products.service';
import { ProductDto } from '../src/dtos/product-dto';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const productIdParam: string = req.params.id;

  context.log(
    `HTTP trigger function processed a request with productIdParam=${productIdParam}`,
  );

  const db: Database = CosmosDb.connect();

  const product: ProductDto = await ProductsService.getProductById(
    db,
    productIdParam,
  );

  if (!product) {
    context.res = {
      status: 404,
      body: { error: `Not Found Product with id=${productIdParam}` },
    };

    return;
  }

  context.res = {
    status: 200,
    body: {
      data: product,
    },
  };
};

export default httpTrigger;
