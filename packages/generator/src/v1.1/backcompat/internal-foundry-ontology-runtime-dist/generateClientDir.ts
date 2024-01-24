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

import path from "node:path";
import type { MinimalFs } from "../../../MinimalFs.js";
import { formatTs } from "../../../util/test/formatTs.js";
import { reexportTypes } from "../util/reexportTypes.js";

export async function generateClientDir(runtimeDistDir: string, fs: MinimalFs) {
  const pagingDir = path.join(runtimeDistDir, "client");
  await fs.mkdir(pagingDir, { recursive: true });

  await fs.writeFile(
    path.join(pagingDir, "index.ts"),
    await formatTs(
      `export * from "./clientOptions";`,
    ),
  );

  await fs.writeFile(
    path.join(pagingDir, "clientOptions.ts"),
    await formatTs(
      `import {Auth} from "@osdk/legacy-client";`
        + reexportTypes(
          ["FoundryClientOptions"],
          "<TAuth extends Auth = Auth>",
        ),
    ),
  );
}
