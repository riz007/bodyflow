import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DRUGS } from "@/data";
import { needsReview, reviewMarkdown } from "./review";

const FILE = "docs/DATA_REVIEW.md";

describe("needsReview report", () => {
  it("docs/DATA_REVIEW.md is up to date (run `npm run review` to regenerate)", () => {
    const md = reviewMarkdown(needsReview(DRUGS));
    if (process.env.UPDATE_REVIEW) writeFileSync(FILE, md);
    expect(existsSync(FILE) ? readFileSync(FILE, "utf8") : "").toBe(md);
  });
});
