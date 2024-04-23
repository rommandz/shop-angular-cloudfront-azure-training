import { Product } from '../models/product';
import { Stock } from '../models/stock';

export class ProductDto {
  public id: string;
  public title: string;
  public description: string;
  public price: number;
  public count: number;

  constructor({ id, title, description, price }: Product, { count }: Stock) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.count = count ?? 0;
  }
}
