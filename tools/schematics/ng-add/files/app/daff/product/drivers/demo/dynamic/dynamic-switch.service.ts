import {
  Injectable,
  Optional,
  OnDestroy,
} from '@angular/core';
import {
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import {
  filter,
  startWith,
  switchMap,
} from 'rxjs/operators';

import {
  DaffDevToolsConfigService,
  DaffDriverConfig,
} from '@daffodil/dev-tools';
import { DaffProduct } from '@daffodil/product';
import {
  DaffProductServiceInterface,
  DaffProductDriverResponse,
} from '@daffodil/product/driver';
import { DaffInMemoryProductService } from '@daffodil/product/driver/in-memory';
import { DaffMagentoProductService } from '@daffodil/product/driver/magento';

import { FakeProductDriverService } from '../fake/fake-product-driver.service';

export type SupportedDriverTypes = 'in-memory' | 'fake' | 'magento';

@Injectable({
  providedIn: 'root',
})
export class DynamicSwitchDriverService implements DaffProductServiceInterface, OnDestroy {
  private currentDriver: DaffProductServiceInterface;
  private currentDriverType: SupportedDriverTypes = 'fake';
  private configSubscription?: Subscription;
  private driverChange$ = new Subject<void>();

  constructor(
    private fakeProductDriver: FakeProductDriverService,
    private inMemoryProductDriver: DaffInMemoryProductService,
    private magentoDriver: DaffMagentoProductService,
    @Optional() private devToolsConfig?: DaffDevToolsConfigService,
  ) {
    this.currentDriver = this.fakeProductDriver;
    this.subscribeToDevToolsConfig();
  }

  ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
    this.driverChange$.complete();
  }

  switchDriver(driverType: 'in-memory' | 'fake' | 'magento'): void {
    if (driverType === 'in-memory') {
      this.currentDriver = this.inMemoryProductDriver;
      this.currentDriverType = driverType;
    } else if (driverType === 'fake') {
      this.currentDriver = this.fakeProductDriver;
      this.currentDriverType = driverType;
    } else if (driverType === 'magento') {
      this.currentDriver = this.magentoDriver;
      this.currentDriverType = driverType;
    }
    this.driverChange$.next();
  }

  private subscribeToDevToolsConfig(): void {
    if (this.devToolsConfig) {
      this.configSubscription = this.devToolsConfig
        .getDriverConfig('@daffodil/product/driver')
        .pipe(
          filter((config): config is DaffDriverConfig => !!config && config.currentDriver !== this.currentDriverType),
        )
        .subscribe((config: DaffDriverConfig) => {
          this.switchDriver(<SupportedDriverTypes>config.currentDriver);
        });
    }
  }

  getAll(): Observable<DaffProduct[]> {
    return this.driverChange$.pipe(
      startWith(null),
      switchMap(() => this.currentDriver.getAll()),
    );
  }

  get(productId: string): Observable<DaffProductDriverResponse<DaffProduct>> {
    return this.driverChange$.pipe(
      startWith(null),
      switchMap(() => this.currentDriver.get(productId)),
    );
  }

  getByUrl(url: string): Observable<DaffProductDriverResponse<DaffProduct>> {
    return this.driverChange$.pipe(
      startWith(null),
      switchMap(() => this.currentDriver.getByUrl(url)),
    );
  }
}
