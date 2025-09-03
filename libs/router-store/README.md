# @daffodil/router-store

Router state utilities for Daffodil applications that integrate with NgRx router-store.

## Overview

This library provides NgRx features that interact with Daffodil state constructors like:

- **Automatic Error Clearing**: Clears errors from state when `ROUTER_NAVIGATED` action is dispatched
- **Entity Support**: Provides a factory for creating reducers that clear errors from NgRx entity collections

## Installation

```bash
npm install --save @daffodil/router-store
```

## Usage

### Basic Error Clearing

Use `daffRouterStateNavigatedClearErrorsReducer` to clear errors from any state that implements `DaffErrorable`:

```typescript
import { daffRouterStateNavigatedClearErrorsReducer } from '@daffodil/router-store';
import { DaffErrorable } from '@daffodil/core/state';

interface MyState extends DaffErrorable {
  data: any[];
  loading: boolean;
}

const myReducer = (state: MyState, action: any): MyState => {
  // Handle router navigation error clearing
  const clearedState = daffRouterStateNavigatedClearErrorsReducer(state, action);
  
  // Handle other actions
  switch (action.type) {
    // ... your action cases
    default:
      return clearedState;
  }
};
```

### Entity Error Clearing

Use `daffRouterStateNavigatedClearEntityErrorsReducerFactory` to create a reducer that clears errors from entity collections:

```typescript
import { createEntityAdapter } from '@ngrx/entity';
import { daffRouterStateNavigatedClearEntityErrorsReducerFactory } from '@daffodil/router-store';
import { DaffErrorable } from '@daffodil/core/state';

interface MyEntity extends DaffErrorable {
  id: string;
  name: string;
}

const adapter = createEntityAdapter<MyEntity>();
const clearEntityErrorsReducer = daffRouterStateNavigatedClearEntityErrorsReducerFactory(adapter);

const entityReducer = (state: EntityState<MyEntity>, action: any) => {
  // Handle router navigation error clearing for entities
  const clearedState = clearEntityErrorsReducer(state, action);
  
  // Handle other actions
  switch (action.type) {
    // ... your action cases
    default:
      return clearedState;
  }
};
```