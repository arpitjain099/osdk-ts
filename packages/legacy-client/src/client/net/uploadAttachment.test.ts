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

import type { ClientContext } from "@osdk/shared.net";
import { createThinClient } from "@osdk/shared.net";
import type { MockedFunction } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MockOntology } from "../../util/test";
import {
  expectFetchToBeCalledWithBlob,
  mockFetchResponse,
} from "../../util/test/fetchUtils";
import { MOCK_ORIGIN } from "../../util/test/mocks/mockMetadata";
import { unwrapResultOrThrow } from "../../util/test/resultUtils";
import { uploadAttachment } from "./uploadAttachment";

describe(uploadAttachment, () => {
  let client: ClientContext<typeof MockOntology>;
  let fetch: MockedFunction<typeof globalThis.fetch>;
  beforeEach(() => {
    fetch = vi.fn();
    client = createThinClient(
      MockOntology,
      MOCK_ORIGIN,
      () => "Token",
      undefined,
      fetch,
    );
  });
  it("uploads attachment", async () => {
    const obj = { name: "James Doe" };
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    mockFetchResponse(fetch, {
      rid: "ri.a.b.c.d",
    });
    const attachmentResult = await uploadAttachment(client, "test.txt", blob);
    const attachment = unwrapResultOrThrow(attachmentResult);
    expectFetchToBeCalledWithBlob(
      fetch,
      `attachments/upload?filename=test.txt`,
      blob,
      `${MOCK_ORIGIN}/api/v1/`,
    );
    expect(attachment.attachmentRid).toEqual("ri.a.b.c.d");
  });
});
