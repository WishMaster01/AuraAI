-- AddIndex
CREATE INDEX "chat_sessions_userId_pinned_updatedAt_idx" ON "chat_sessions"("userId", "pinned", "updatedAt");

