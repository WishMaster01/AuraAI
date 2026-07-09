import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { knowledgeBase } from "../knowledge/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datasetPath = path.resolve(__dirname, "../datasets/voice-commands.jsonl");

let cachedCorpus = null;

const readJsonlExamples = () => {
  if (!fs.existsSync(datasetPath)) return [];
  const raw = fs.readFileSync(datasetPath, "utf8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return { ...JSON.parse(line), source: "voice-commands.jsonl", index };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
};

const buildCorpus = () => {
  const examples = readJsonlExamples().map((item) => ({
    title: item.intent || item.input || `Example ${item.index + 1}`,
    source: item.source,
    content: JSON.stringify(item),
  }));

  return [...knowledgeBase, ...examples];
};

const tokenize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);

const buildSnippet = (content, terms) => {
  const normalized = String(content || "").replace(/\s+/g, " ");
  if (!terms.length) {
    return normalized.slice(0, 320);
  }

  const lower = normalized.toLowerCase();
  let bestIndex = -1;

  for (const term of terms) {
    const index = lower.indexOf(term);
    if (index !== -1) {
      bestIndex = bestIndex === -1 ? index : Math.min(bestIndex, index);
    }
  }

  if (bestIndex === -1) {
    return normalized.slice(0, 320);
  }

  const start = Math.max(0, bestIndex - 120);
  const end = Math.min(normalized.length, bestIndex + 220);
  return normalized.slice(start, end).trim();
};

export const getRelevantKnowledge = (query, limit = 3) => {
  if (!cachedCorpus) {
    cachedCorpus = buildCorpus();
  }

  const terms = tokenize(query);
  return cachedCorpus
    .map((item) => {
      const lower = item.content.toLowerCase();
      const score = terms.reduce((total, term) => {
        if (lower.includes(term)) return total + 2;
        if (item.title.toLowerCase().includes(term)) return total + 3;
        return total;
      }, 0);

      return {
        title: item.title,
        source: item.source,
        snippet: buildSnippet(item.content, terms),
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0)
    .slice(0, limit);
};
