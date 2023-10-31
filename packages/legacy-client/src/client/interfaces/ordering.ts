/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type {
  LocalDate,
  OntologyObject,
  OrderByClause,
  OrderByOption,
  Timestamp,
} from "../../ontology-runtime";
type IsOrderableProperty<T> = T extends
  number | LocalDate | Timestamp | string | boolean | undefined ? true : false;

type OrderableProperties<T extends OntologyObject> = {
  [K in keyof T as IsOrderableProperty<T[K]> extends true ? K : never]: T[K];
};

export declare type OrderByFunction<T extends OntologyObject> = (
  object: OrderBy<T>,
) => OrderByClause;

export declare type OrderBy<T extends OntologyObject> = {
  [
    K in keyof Omit<
      OrderableProperties<T>,
      "__apiName" | "__rid" | "__primaryKey"
    >
  ]: OrderByOption;
};
