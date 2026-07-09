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
  test("chat integration tests are skipped without DATABASE_URL", { skip: true }, () => {});
} else {
  let serverContext;
  let cookieHeader = "";
  const uniqueEmail = `auraai-chat-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;

  before(async () => {
    serverContext = await createIntegrationServer();

    const signup = await jsonRequest(serverContext.baseUrl, "/api/auth/signup", {
      method: "POST",
      body: {
        name: "Chat Test",
        email: uniqueEmail,
        password: "password123",
      },
    });

    cookieHeader = getCookieHeader(signup.response);
  });

  after(async () => {
    await closeIntegrationServer(serverContext?.server);
  });

  test("chat sessions can be created, renamed, pinned, messaged, and deleted", async () => {
    const created = await jsonRequest(serverContext.baseUrl, "/api/user/chats", {
      method: "POST",
      headers: { Cookie: cookieHeader },
      body: { title: "Production Chat" },
    });

    assert.equal(created.response.status, 201);
    assert.equal(created.data?.title, "Production Chat");

    const chatId = created.data?._id;
    assert.ok(chatId);

    const updated = await jsonRequest(
      serverContext.baseUrl,
      `/api/user/chats/${chatId}`,
      {
        method: "PATCH",
        headers: { Cookie: cookieHeader },
        body: { title: "Renamed Chat", pinned: true },
      }
    );

    assert.equal(updated.response.status, 200);
    assert.equal(updated.data?.title, "Renamed Chat");
    assert.equal(updated.data?.pinned, true);

    const addedMessage = await jsonRequest(
      serverContext.baseUrl,
      `/api/user/chats/${chatId}/messages`,
      {
        method: "POST",
        headers: { Cookie: cookieHeader },
        body: { role: "user", content: "Hello AuraAI" },
      }
    );

    assert.equal(addedMessage.response.status, 200);
    assert.ok(Array.isArray(addedMessage.data?.messages));
    assert.ok(addedMessage.data.messages.length > 0);

    const sessionList = await jsonRequest(serverContext.baseUrl, "/api/user/chats", {
      headers: { Cookie: cookieHeader },
    });

    assert.equal(sessionList.response.status, 200);
    assert.ok(Array.isArray(sessionList.data?.sessions));
    assert.ok(sessionList.data.sessions.some((chat) => chat._id === chatId));

    const deleted = await jsonRequest(
      serverContext.baseUrl,
      `/api/user/chats/${chatId}`,
      {
        method: "DELETE",
        headers: { Cookie: cookieHeader },
      }
    );

    assert.equal(deleted.response.status, 200);
    assert.equal(deleted.data?.success, true);
  });
}
