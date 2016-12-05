/* @flow */
/* eslint-disable no-unused-vars */
import {List} from 'immutable';
import React from 'react';

type HockApplier = (ComposedComponent: ReactClass<any>) => ReactClass<any>;

type OnChange = (newValue: string|boolean) => void;

type OnClick = (event: Object) => void;

type Modifier = string | Object;
