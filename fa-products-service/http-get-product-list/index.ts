import { AzureFunction, Context } from '@azure/functions';
import { productsMock } from '../mocks/products-mock';

const httpTrigger: AzureFunction = async function (
  context: Context,
): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  context.res = {
    body: productsMock,
  };
};

export default httpTrigger;
