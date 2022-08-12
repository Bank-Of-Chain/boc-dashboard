import { toFixed } from "@/utils/number-format";

test("number-format toFixed", () => {
  const text = toFixed("10000", "100");
  expect(text).toBe("100");
});
