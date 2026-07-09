import { test, expect } from "@playwright/test";

const canRun = Boolean(
  globalThis.process?.env?.E2E_AUTH_EMAIL &&
    globalThis.process?.env?.E2E_AUTH_PASSWORD
);

test.describe("Assistant chat flow", () => {
  test.skip(!canRun, "Set E2E_AUTH_EMAIL and E2E_AUTH_PASSWORD to run assistant chat e2e");

  test("opens the chat interface after login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(globalThis.process?.env?.E2E_AUTH_EMAIL);
    await page.getByLabel("Password").fill(globalThis.process?.env?.E2E_AUTH_PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByText(/command session/i)).toBeVisible();
    await expect(page.getByRole("textbox", { name: /chat message input/i })).toBeVisible();
  });
});
