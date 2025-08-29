import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  InMemoryDbService,
  RequestInfo,
} from 'angular-in-memory-web-api';
import {
  combineLatest,
  map,
  take,
} from 'rxjs';

import { observe } from '@daffodil/core';

import { DAFF_IN_MEMORY_BACKENDS } from './backends.token';
import { DaffInMemoryDataServiceInterface } from './data-service.type';
import { DaffInMemoryBackendDelegate } from './delegate.class';
import { DaffInMemoryBackendInterface } from './type';
import {
  DAFF_IN_MEMORY_DRIVER_CONFIG,
  DaffInMemoryDriverConfig,
} from '../public_api';

/**
 * An in-memory backend that automatically delegates requests to backends provided to {@link DAFF_IN_MEMORY_BACKENDS}.
 *
 * @inheritdoc
 */
@Injectable({
  providedIn: 'root',
})
export class DaffInMemoryRootBackend extends DaffInMemoryBackendDelegate implements DaffInMemoryDataServiceInterface, InMemoryDbService {
  constructor(
    @Inject(DAFF_IN_MEMORY_BACKENDS) private _backends: Array<DaffInMemoryBackendInterface>,
    @Inject(DAFF_IN_MEMORY_DRIVER_CONFIG) private _config: DaffInMemoryDriverConfig,
  ) {
    super(_backends, _config);
  }

  createDb(reqInfo?: RequestInfo) {
    return combineLatest(this._backends.map(observe)).pipe(
      take(1),
      map((backends) => backends.reduce((db, backend) => ({
        ...db,
        ...backend.createDb(reqInfo),
      }), {})),
    );
  }
}
