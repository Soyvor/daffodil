import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DaffProduct } from '@daffodil/product';
import {
  DaffProductDriverResponse,
  DaffProductServiceInterface,
} from '@daffodil/product/driver';

import { FakeProduct } from './fake-product';
import { transformFakeProduct } from './transform';

@Injectable({
  providedIn: 'root',
})
export class FakeProductDriverService implements DaffProductServiceInterface {
  readonly url: string = 'https://fakestoreapi.com/';

  constructor(private client: HttpClient) { }

  getAll(): Observable<DaffProduct[]> {
    return this.client.get<FakeProduct[]>(this.url + 'products').pipe(
      map((fakeProducts: FakeProduct[]): DaffProduct[] => fakeProducts.map(transformFakeProduct)),
    );
  }

  getBestSellers(): Observable<DaffProduct[]> {
    throw new Error('Method not implemented.');
  }
  get(productId: string): Observable<DaffProductDriverResponse<DaffProduct>> {
    throw new Error('Method not implemented.');
  }
  getByUrl(url: string): Observable<DaffProductDriverResponse<DaffProduct>> {
    throw new Error('Method not implemented.');
  }
}
