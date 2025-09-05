import {
  Injectable,
  Optional,
  OnDestroy,
} from '@angular/core';
import {
  Observable,
  Subject,
  Subscription,
  throwError,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
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

@Injectable({
  providedIn: 'root',
})
export class DynamicSwitchDriverService implements DaffProductServiceInterface, OnDestroy {
  private currentDriverService: DaffProductServiceInterface;
  private configSubscription?: Subscription;
  private driverChange$ = new Subject<void>();

  constructor(
    private fakeProductDriver: FakeProductDriverService,
    private inMemoryProductDriver: DaffInMemoryProductService,
    private magentoDriver: DaffMagentoProductService,
    @Optional() private devToolsConfig?: DaffDevToolsConfigService,
  ) {
    this.currentDriverService = this.fakeProductDriver;
    this.subscribeToDevToolsConfig();
  }

  ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
    this.driverChange$.complete();
  }

  switchDriver(driverType: string): void {
    if (driverType === 'in-memory') {
      this.currentDriverService = this.inMemoryProductDriver;
    } else if (driverType === 'fake') {
      this.currentDriverService = this.fakeProductDriver;
    } else if (driverType === 'magento') {
      this.currentDriverService = this.magentoDriver;
    } else {
      return;
    }
    this.driverChange$.next();
  }

  private subscribeToDevToolsConfig(): void {
    if (this.devToolsConfig) {
      this.configSubscription = this.devToolsConfig
        .getDriverConfig('@daffodil/product/driver')
        .pipe(
          filter((config): config is DaffDriverConfig => !!config),
          distinctUntilChanged(),
        )
        .subscribe((config: DaffDriverConfig) => {
          this.switchDriver(config.currentDriver?.id);
        });
    }
  }

  getAll(): Observable<DaffProduct[]> {
    return this.driverChange$.pipe(
      startWith(null),
      switchMap(() => this.currentDriverService.getAll().pipe(
        catchError((error) =>
          // Let the error bubble up but don't kill the outer stream
          throwError(() => error),
        ),
      )),
    );
  }

  get(productId: string): Observable<DaffProductDriverResponse<DaffProduct>> {
    return this.driverChange$.pipe(
      startWith(null),
      switchMap(() => this.currentDriverService.get(productId).pipe(
        catchError((error) => throwError(() => error)),
      )),
    );
  }

  getByUrl(url: string): Observable<DaffProductDriverResponse<DaffProduct>> {
    return this.driverChange$.pipe(
      startWith(null),
      switchMap(() => this.currentDriverService.getByUrl(url).pipe(
        catchError((error) => throwError(() => error)),
      )),
    );
  }
}
