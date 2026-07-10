import jwt from "jsonwebtoken";
import { clerkClient, getAuth } from "@clerk/express";
import prisma from "../configs/prisma.js";
import { userInclude } from "../utils/userSerializers.js";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const buildDisplayName = (clerkUser) => {
  const firstName = String(clerkUser?.firstName || "").trim();
  const lastName = String(clerkUser?.lastName || "").trim();
  const username = String(clerkUser?.username || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return fullName || username || "User";
};

const getClerkEmail = (clerkUser) => {
  const primary = clerkUser?.emailAddresses?.find(
    (entry) => entry.id === clerkUser?.primaryEmailAddressId
  );

  return normalizeEmail(
    primary?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress
  );
};

const syncClerkUser = async (clerkUserId) => {
  if (!clerkUserId) return null;

  const existingByClerkId = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    include: userInclude,
  });

  if (existingByClerkId) {
    return existingByClerkId;
  }

  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const email = getClerkEmail(clerkUser);

  if (!email) {
    throw new Error("Clerk user does not have a verified email address.");
  }

  const name = buildDisplayName(clerkUser);

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
    include: userInclude,
  });

  if (existingByEmail) {
    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        clerkId: clerkUserId,
        name: existingByEmail.name || name,
        email,
      },
      include: userInclude,
    });
  }

  return prisma.user.create({
    data: {
      clerkId: clerkUserId,
      name,
      email,
      password: null,
    },
    include: userInclude,
  });
};

const syncLegacyUser = async (token) => {
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.userId) return null;

    return prisma.user.findUnique({
      where: { id: payload.userId },
      include: userInclude,
    });
  } catch {
    return null;
  }
};

export const resolveAuthenticatedUser = async (req) => {
  const clerkAuth = getAuth(req);
  if (clerkAuth?.isAuthenticated && clerkAuth.userId) {
    const localUser = await syncClerkUser(clerkAuth.userId);
    if (localUser) {
      return {
        user: localUser,
        provider: "clerk",
        clerkUserId: clerkAuth.userId,
      };
    }
  }

  const legacyUser = await syncLegacyUser(req.cookies?.token);
  if (legacyUser) {
    return {
      user: legacyUser,
      provider: "legacy",
      clerkUserId: null,
    };
  }

  return null;
};

