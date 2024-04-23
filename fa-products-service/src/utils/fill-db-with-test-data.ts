import { faker } from '@faker-js/faker';
import { Container, Database } from '@azure/cosmos';
import { Product } from '../models/product';
import { Stock } from '../models/stock';
import { CosmosDb } from '../cosmos-db/cosmos-db';

const createRandomData = (): {
  products: Product[];
  stocks: Stock[];
} => {
  const data = faker.helpers.multiple(
    () => {
      const id: string = faker.string.uuid();

      return {
        product: {
          id,
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          price: faker.number.int({ min: 1, max: 200 }),
        },
        stock: {
          product_id: id,
          count: faker.number.int({ min: 1, max: 10 }),
        },
      };
    },
    { count: 10 },
  );

  return {
    products: data.map(({ product }) => product),
    stocks: data.map(({ stock }) => stock),
  };
};

export const fillDBWithTestData = async () => {
  const db: Database = CosmosDb.connect();
  const productContainer: Container = db.container(CosmosDb.PRODUCT_CONTAINER);
  const stockContainer: Container = db.container(CosmosDb.STOCK_CONTAINER);

  const { products, stocks } = createRandomData();

  try {
    for await (const product of products) {
      await productContainer.items.upsert(product);
    }

    for await (const stock of stocks) {
      await stockContainer.items.upsert(stock);
    }
  } catch (e) {
    console.error('Table recording is failed', e);
  }
};
