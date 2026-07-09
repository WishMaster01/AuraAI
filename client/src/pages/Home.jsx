import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Search,
  Pin,
  Pencil,
  Trash2,
  Download,
  FileText,
  Languages,
  WandSparkles,
  MessageSquareText,
} from "lucide-react";
import { userDataContext } from "../context/UserContext.jsx";
import Surface from "../components/ui/Surface.jsx";
import Button from "../components/ui/Button.jsx";
import { requestAssistantReply } from "../services/assistantApi.js";
import AssistantChat from "../components/assistant/AssistantChat.jsx";
import CommandInput from "../components/assistant/CommandInput.jsx";
import QuickActions from "../components/assistant/QuickActions.jsx";
import PageAssistant from "../components/assistant/PageAssistant.jsx";

const Home = () => {
  const { userData, setUserData, api } = useContext(userDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState(location.state?.prefilledPrompt || "");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [search, setSearch] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const pageContext = location.state?.pageContext || null;

  const refreshChats = useCallback(async () => {
    setIsLoadingChats(true);
    try {
      const response = await api.get("/api/user/chats?limit=50");
      const payload = response.data;
      const sessions = Array.isArray(payload?.sessions)
        ? payload.sessions
        : Array.isArray(payload)
          ? payload
          : [];
      setChats(sessions);
      setActiveChatId((current) => current || sessions[0]?._id || null);
    } catch (error) {
      console.error("Unable to load chats:", error);
    } finally {
      setIsLoadingChats(false);
    }
  }, [api]);

  const activeChat = useMemo(
    () =>
      chats.find((chat) => chat._id === activeChatId) ||
      chats[0] || { messages: [], title: "New Chat" },
    [activeChatId, chats]
  );

  const messages = activeChat.messages || [];
  const userInitial = (userData?.name || "U").charAt(0).toUpperCase();
  const assistantAvatar = userData?.assistantImage;
  const welcome = useMemo(
    () => `Hi ${userData?.name || "there"}, ask ${userData?.assistantName || "AuraAI"} anything.`,
    [userData?.assistantName, userData?.name]
  );

  const quickActions = useMemo(
    () => [
      {
        label: "Summarize page",
        prompt: "Summarize the following page content into key takeaways:",
        icon: FileText,
      },
      {
        label: "Explain text",
        prompt: "Explain the following text in simple terms:",
        icon: MessageSquareText,
      },
      {
        label: "Rewrite",
        prompt: "Rewrite the following text with a clearer, professional tone:",
        icon: WandSparkles,
      },
      {
        label: "Translate",
        prompt: "Translate the following text to English:",
        icon: Languages,
      },
    ],
    []
  );

  const sidebarActions = useMemo(
    () => [
      "Dashboard",
      "Tools",
      "Prompts",
      "Customize",
    ],
    []
  );

  const filteredChats = useMemo(
    () =>
      chats
        .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => Number(b.pinned) - Number(a.pinned)),
    [chats, search]
  );

  useEffect(() => {
    refreshChats();
  }, [refreshChats]);

  useEffect(() => {
    if (location.state?.prefilledPrompt) {
      setInput(location.state.prefilledPrompt);
      inputRef.current?.focus();
    }
  }, [location.state]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
      setUserData(null);
      navigate("/login");
    } catch {
      setUserData(null);
      navigate("/login");
    }
  };

  const ensureActiveChat = useCallback(
    async (title = "New Chat") => {
      if (activeChat?._id) return activeChat;
      const response = await api.post("/api/user/chats", { title });
      setChats((prev) => [response.data, ...prev]);
      setActiveChatId(response.data?._id);
      return response.data;
    },
    [activeChat, api]
  );

  const handleNewChat = useCallback(async () => {
    try {
      const response = await api.post("/api/user/chats", { title: "New Chat" });
      setChats((prev) => [response.data, ...prev]);
      setActiveChatId(response.data?._id);
      setInput("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Unable to create chat:", error);
    }
  }, [api]);

  const navigateFromIntent = useCallback(
    (intent) => {
      const routes = {
        open_dashboard: "/dashboard",
        open_tools: "/tools",
        open_prompts: "/prompts",
        open_customize: "/customize",
        open_settings: "/customize",
        open_about: "/about",
        open_contact: "/contact",
        open_privacy: "/privacy",
        open_legal: "/legal",
        open_assistant: "/assistant",
      };
      const route = routes[intent];
      if (route) {
        navigate(route);
        return;
      }

      if (intent === "open_youtube") {
        window.location.assign("https://www.youtube.com");
      }
    },
    [navigate]
  );

  const runCommand = useCallback(
    async (command) => {
      const cleanCommand = String(command || "").trim();
      if (!cleanCommand) return;

      const session = await ensureActiveChat(cleanCommand.slice(0, 40) || "New Chat");
      await api.post(`/api/user/chats/${session._id}/messages`, {
        role: "user",
        content: cleanCommand,
      });

      if (!session.messages?.length || session.title === "New Chat") {
        await api.patch(`/api/user/chats/${session._id}`, {
          title: cleanCommand.slice(0, 40),
        });
      }

      setInput("");
      setIsTyping(true);

      try {
        const data = await requestAssistantReply({
          api,
          command: cleanCommand,
          assistantName: userData?.assistantName || "AuraAI",
          userName: userData?.name || "User",
          pageContext,
        });

        await api.post(`/api/user/chats/${session._id}/messages`, {
          role: "assistant",
          content: data?.response || "I could not process that.",
        });

        navigateFromIntent(data?.intent);
      } finally {
        setIsTyping(false);
        await refreshChats();
      }
    },
    [api, ensureActiveChat, navigateFromIntent, pageContext, refreshChats, userData?.assistantName, userData?.name]
  );

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      await runCommand(transcript);
    };
    recognition.start();
  };

  const handleQuickAction = (action) => {
    setInput(action.prompt);
    inputRef.current?.focus();
  };

  const handleSidebarAction = (action) => {
    const routes = {
      Dashboard: "/dashboard",
      Tools: "/tools",
      Prompts: "/prompts",
      Customize: "/customize",
    };
    const route = routes[action];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="aura-page min-h-screen pb-20 text-slate-100 md:pb-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-3 py-4 sm:px-4 md:py-6 lg:grid-cols-[18.5rem_1fr]">
        <aside className="flex flex-col gap-3" aria-label="Chat sidebar">
          <PageAssistant
            title={userData?.assistantName || "AuraAI"}
            subtitle={welcome}
            status="Live"
            actions={sidebarActions}
            onAction={handleSidebarAction}
          />

          <Surface className="p-3 sm:p-4">
            <div className="space-y-2">
              <Button className="w-full" onClick={handleNewChat}>
                New Chat
              </Button>
              <Link
                className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.1]"
                to="/dashboard"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                to="/tools"
              >
                AI Tools
              </Link>
              <Link
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                to="/prompts"
              >
                Prompt Library
              </Link>
              <Link
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                to="/customize"
              >
                Customize Assistant
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-200 transition hover:bg-red-500/10"
                aria-label="Logout"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </Surface>

          <Surface className="p-3">
            <label
              htmlFor="chat-search"
              className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400"
            >
              <Search size={12} /> Search chats
            </label>
            <input
              id="chat-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="aura-input px-3 py-2 text-sm"
              placeholder="Find chat..."
            />
          </Surface>

          <Surface className="flex-1 p-3">
            <div
              className="aura-scrollbar max-h-72 space-y-2 overflow-y-auto pr-1 lg:max-h-[42vh]"
              role="list"
              aria-label="Chat sessions"
            >
              {!isLoadingChats &&
                filteredChats.map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => setActiveChatId(chat._id)}
                    role="listitem"
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                      chat._id === activeChat._id
                        ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-50"
                        : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">
                        {chat.pinned ? "Pinned - " : ""}
                        {chat.title}
                      </span>
                    </div>
                  </button>
                ))}
              {isLoadingChats && (
                <div className="space-y-2">
                  <div className="aura-shimmer h-10 rounded-lg bg-white/[0.05]" />
                  <div className="aura-shimmer h-10 rounded-lg bg-white/[0.05]" />
                  <div className="aura-shimmer h-10 rounded-lg bg-white/[0.05]" />
                </div>
              )}
            </div>
          </Surface>
        </aside>

        <section
          className="aura-glass flex min-h-[calc(100vh-8.5rem)] flex-col overflow-hidden rounded-lg lg:min-h-[calc(100vh-7.5rem)]"
          aria-label="Assistant conversation panel"
        >
          <div className="border-b border-white/10 p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-cyan-200">Command session</p>
                <h1 className="aura-heading mt-0.5 truncate text-lg font-bold sm:text-xl">
                  {activeChat.title}
                </h1>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="rounded-lg border border-white/15 bg-white/[0.04] p-2 text-slate-300 transition hover:border-cyan-300/45 hover:bg-white/[0.08] hover:text-white"
                  onClick={async () => {
                    const value = window.prompt("Rename chat", activeChat.title);
                    if (!value?.trim()) return;
                    await api.patch(`/api/user/chats/${activeChat._id}`, { title: value.trim() });
                    await refreshChats();
                  }}
                  aria-label="Rename chat"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/15 bg-white/[0.04] p-2 text-slate-300 transition hover:border-cyan-300/45 hover:bg-white/[0.08] hover:text-white"
                  onClick={async () => {
                    await api.patch(`/api/user/chats/${activeChat._id}`, {
                      pinned: !activeChat.pinned,
                    });
                    await refreshChats();
                  }}
                  aria-label="Pin chat"
                >
                  <Pin size={15} />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/15 bg-white/[0.04] p-2 text-slate-300 transition hover:border-cyan-300/45 hover:bg-white/[0.08] hover:text-white"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(activeChat, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${activeChat.title.replace(/\s+/g, "_")}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  aria-label="Export chat"
                >
                  <Download size={15} />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-red-400/30 bg-red-500/10 p-2 text-red-200 transition hover:bg-red-500/15"
                  onClick={async () => {
                    if (chats.length <= 1) return;
                    await api.delete(`/api/user/chats/${activeChat._id}`);
                    await refreshChats();
                  }}
                  aria-label="Delete chat"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <QuickActions
              actions={quickActions}
              onSelect={handleQuickAction}
              className="mt-4"
            />
          </div>

          <AssistantChat
            messages={messages}
            isTyping={isTyping}
            assistantAvatar={assistantAvatar}
            userInitial={userInitial}
          />

          <CommandInput
            value={input}
            onChange={setInput}
            onSubmit={() => runCommand(input)}
            onVoice={handleVoiceInput}
            inputRef={inputRef}
            isListening={isListening}
            isSubmitting={isTyping}
          />
        </section>
      </div>
    </div>
  );
};

export default Home;
