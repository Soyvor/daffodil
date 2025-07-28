import { DaffProduct } from '@daffodil/product';
import {
  DaffProductPageActions,
  DaffProductPageActionTypes,
  DaffProductPageLoadSuccess,
} from '@daffodil/product/state';
import { DaffUpsellProduct } from '@daffodil/upsell-products';

import { DaffUpsellProductsReducerState } from './reducer-state.interface';

/**
 * Initial values of the upsell product state.
 */
export const initialState: DaffUpsellProductsReducerState = {
  upsellProductIds: [],
};

export const getUpsellProductIds = <T extends DaffProduct>(action: DaffProductPageLoadSuccess<T>): string[] =>
  (<DaffUpsellProduct><unknown>action.payload.products.filter(({ id }) => id === action.payload.id)[0]).upsell?.map(({ id }) => id) || [];

/**
 * Reducer function that catches actions and changes/overwrites upsell product state.
 */
export function daffUpsellProductsReducer<T extends DaffProduct>(state = initialState, action: DaffProductPageActions<T>): DaffUpsellProductsReducerState {
  switch (action.type) {
    case DaffProductPageActionTypes.ProductPageLoadSuccessAction:
      return {
        ...state,
        upsellProductIds: getUpsellProductIds(action),
      };
    default:
      return state;
  }
}
