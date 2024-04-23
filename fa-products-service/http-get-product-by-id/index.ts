import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Product } from '../models/Product';
import { productsMock } from '../mocks/products-mock';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const productIdParam: string = req.params.id;
  const product: Product = productsMock.find(
    (product: Product) => product.id === productIdParam,
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
    body: product,
  };
};

export default httpTrigger;
