import { test, expect } from "@playwright/test";

const canRun = Boolean(
  globalThis.process?.env?.E2E_AUTH_EMAIL &&
    globalThis.process?.env?.E2E_AUTH_PASSWORD
);

test.describe("Login flow", () => {
  test.skip(!canRun, "Set E2E_AUTH_EMAIL and E2E_AUTH_PASSWORD to run login e2e");

  test("logs in and reaches the assistant shell", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();

    await page.getByLabel("Email").fill(globalThis.process?.env?.E2E_AUTH_EMAIL);
    await page.getByLabel("Password").fill(globalThis.process?.env?.E2E_AUTH_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
  });
});
