import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import {
  DaffAuthActions,
  DaffAuthLoginActionTypes,
  DaffAuthLoginActions,
  DaffAuthRegisterActionTypes,
  DaffAuthRegisterActions,
  DaffAuthResetPasswordActionTypes,
  DaffAuthResetPasswordActions,
} from '@daffodil/auth/state';

import {
  DaffAuthRoutingConfig,
  DAFF_AUTH_ROUTING_CONFIG,
} from '../config/public_api';

/**
 * Handles redirects after successful authentication-related actions.
 */
@Injectable()
export class DaffAuthRedirectEffects {

  constructor(
    private actions$: Actions<
      DaffAuthLoginActions | 
      DaffAuthActions | 
      DaffAuthRegisterActions | 
      DaffAuthResetPasswordActions
    >,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(DAFF_AUTH_ROUTING_CONFIG) private config: DaffAuthRoutingConfig,
  ) {}

  redirectAfterAuth$ = createEffect(() => 
    this.actions$.pipe(
      ofType(
        DaffAuthLoginActionTypes.LoginSuccessAction,
        DaffAuthRegisterActionTypes.RegisterSuccessAction,
        DaffAuthResetPasswordActionTypes.ResetPasswordSuccessAction,
      ),
      // Only continue if the action has a token when needed
      filter(action => {
        const requiresToken = [
          DaffAuthRegisterActionTypes.RegisterSuccessAction,
          DaffAuthResetPasswordActionTypes.ResetPasswordSuccessAction
        ];
        return !requiresToken.includes(action.type as any) || Boolean((action as any).token);
      }),
      tap(() => {
        const redirectUrl = this.route.snapshot.queryParamMap.get(this.config.redirectUrlParam);
        this.router.navigateByUrl(redirectUrl || this.config.authCompleteRedirectPath);
      }),
      switchMap(() => EMPTY)
    ),
    { dispatch: false }
  );
}
