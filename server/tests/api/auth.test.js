import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import {
  closeIntegrationServer,
  createIntegrationServer,
  getCookieHeader,
  hasDatabaseUrl,
  jsonRequest,
} from "../helpers/integrationServer.js";

if (!hasDatabaseUrl) {
  test("auth integration tests are skipped without DATABASE_URL", { skip: true }, () => {});
} else {
  let serverContext;
  let cookieHeader = "";
  const uniqueEmail = `auraai-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;

  before(async () => {
    serverContext = await createIntegrationServer();
  });

  after(async () => {
    await closeIntegrationServer(serverContext?.server);
  });

  test("signup, current user, and logout work together", async () => {
    const signup = await jsonRequest(serverContext.baseUrl, "/api/auth/signup", {
      method: "POST",
      body: {
        name: "Aura Test",
        email: uniqueEmail,
        password: "password123",
      },
    });

    assert.equal(signup.response.status, 201);
    assert.ok(signup.data?.email);

    cookieHeader = getCookieHeader(signup.response);
    assert.ok(cookieHeader.includes("token="));

    const currentUser = await jsonRequest(serverContext.baseUrl, "/api/user/current", {
      headers: { Cookie: cookieHeader },
    });

    assert.equal(currentUser.response.status, 200);
    assert.equal(currentUser.data?.email, uniqueEmail.toLowerCase());

    const logout = await jsonRequest(serverContext.baseUrl, "/api/auth/logout", {
      method: "GET",
      headers: { Cookie: cookieHeader },
    });

    assert.equal(logout.response.status, 200);
  });
}

