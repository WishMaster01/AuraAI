export const serializeMessage = (message) => ({
  _id: message.id,
  role: message.role,
  content: message.content,
  createdAt: message.createdAt,
});

export const serializeChatSession = (session) => ({
  _id: session.id,
  title: session.title,
  pinned: session.pinned,
  messages: (session.messages || []).map(serializeMessage),
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});

export const serializeUser = (user) => {
  if (!user) return null;

  return {
    _id: user.id,
    id: user.id,
    name: user.name,
    email: user.email,
    assistantName: user.assistantName,
    assistantImage: user.assistantImage,
    history: (user.historyRecords || []).map((entry) => entry.content),
    chatSessions: (user.chatSessions || []).map(serializeChatSession),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const userInclude = {
  historyRecords: {
    orderBy: { createdAt: "desc" },
  },
  chatSessions: {
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  },
};
