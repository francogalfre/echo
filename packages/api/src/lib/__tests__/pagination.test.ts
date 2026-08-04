import { describe, expect, it } from "vitest";

import { paginateRows } from "../pagination";

describe("paginateRows", () => {
  it("should report hasMore true and trim the extra row when one comes back", () => {
    const rows = [1, 2, 3];

    const result = paginateRows(rows, 2);

    expect(result).toEqual({ items: [1, 2], hasMore: true });
  });

  it("should report hasMore false and keep every row when no extra row comes back", () => {
    const rows = [1, 2];

    const result = paginateRows(rows, 2);

    expect(result).toEqual({ items: [1, 2], hasMore: false });
  });
});
