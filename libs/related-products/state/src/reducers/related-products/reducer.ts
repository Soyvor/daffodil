import { DaffProduct } from '@daffodil/product';
import {
  DaffProductPageActions,
  DaffProductPageActionTypes,
  DaffProductPageLoadSuccess,
} from '@daffodil/product/state';
import { DaffRelatedProduct } from '@daffodil/related-products';

import { DaffRelatedProductsReducerState } from './reducer-state.interface';

/**
 * Initial values of the related product state.
 */
export const initialState: DaffRelatedProductsReducerState = {
  relatedProductIds: [],
};

export const getRelatedProductIds = <T extends DaffProduct>(action: DaffProductPageLoadSuccess<T>): string[] =>
  (<DaffRelatedProduct><unknown>action.payload.products.filter(({ id }) => id === action.payload.id)[0]).related?.map(({ id }) => id) || [];

/**
 * Reducer function that catches actions and changes/overwrites related product state.
 */
export function daffRelatedProductsReducer<T extends DaffProduct>(state = initialState, action: DaffProductPageActions<T>): DaffRelatedProductsReducerState {
  switch (action.type) {
    case DaffProductPageActionTypes.ProductPageLoadSuccessAction:
      return {
        ...state,
        relatedProductIds: getRelatedProductIds(action),
      };
    default:
      return state;
  }
}
