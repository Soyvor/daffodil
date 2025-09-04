import { Injectable } from '@angular/core';
import { faker } from '@faker-js/faker/locale/en_US';

import { DaffModelFactory } from '@daffodil/core/testing';
import { DaffProductImage } from '@daffodil/product';

const productImageUrlsList: string[] = [
  'https://assets.daff.io/elegant_gold_soap.png',
  'https://assets.daff.io/elegant_plastic_gloves.png',
  'https://assets.daff.io/ergonomic_bronze_pants.png',
  'https://assets.daff.io/fantastic_aluminum_keyboard.png',
  'https://assets.daff.io/frozen_metal_soap_bubbles.png',
  'https://assets.daff.io/frozen_metal_soap.png',
  'https://assets.daff.io/handcrafted_bamboo_cheese.png',
  'https://assets.daff.io/incredible_ceramic_bike_blue.png',
  'https://assets.daff.io/modern_bronze_chair.png',
  'https://assets.daff.io/modern_granite_tuna.png',
  'https://assets.daff.io/recycled_wooden_table.png',
  'https://assets.daff.io/refined_cotton_pants.png',
  'https://assets.daff.io/refined_rubber_gloves.png',
  'https://assets.daff.io/rustic_bronze_computer.png',
  'https://assets.daff.io/rustic_ceramic_chips.png',
  'https://assets.daff.io/sleek_metal_shirt.png',
  'https://assets.daff.io/soft_granite_pants.png',
  'https://assets.daff.io/tasty_wooden_sausages.png',
];

/**
 * Mocked DaffProductImage object.
 */
export class MockProductImage implements DaffProductImage {
  id = faker.string.uuid();
  url = productImageUrlsList[faker.number.int(productImageUrlsList.length-1)];
  label = faker.lorem.sentence();
}

/**
 * A factory for creating DaffProductImage.
 */
@Injectable({
  providedIn: 'root',
})
export class DaffProductImageFactory extends DaffModelFactory<DaffProductImage> {
  constructor(){
    super(MockProductImage);
  }
}
