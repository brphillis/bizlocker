import invariant from "tiny-invariant";
import type { Staff, User } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { generateAccessToken, generateRefreshToken } from "./auth.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const USER_SESSION_KEY = "userData";
export const STAFF_SESSION_KEY = "staffData";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  const session = await sessionStorage.getSession(cookie);
  return session;
}

export async function getUserDataFromSession(
  request: Request,
  sessionKey: string = USER_SESSION_KEY,
): Promise<User | Staff | undefined | null> {
  const session = await getSession(request);
  const userData = session.get(sessionKey);

  if (userData) {
    if (typeof userData === "string") {
      return JSON.parse(userData);
    } else {
      return userData;
    }
  } else return null;
}

export async function createUserSession({
  request,
  user,
  remember,
  redirectTo,
}: {
  request: Request;
  user: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);

  // Generate tokens using the payload
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  session.set(USER_SESSION_KEY, user); // Store the payload in the session

  // Commit the session to get the session cookie string
  const sessionCookie = await sessionStorage.commitSession(session, {
    maxAge: remember
      ? 60 * 60 * 24 * 7 // 7 days
      : undefined,
  });

  // Create "Set-Cookie" headers for each cookie
  const headers = new Headers();
  headers.append("Set-Cookie", sessionCookie);
  headers.append(
    "Set-Cookie",
    `access_token=${accessToken}; HttpOnly; SameSite=Lax; Path=/;`,
  );
  headers.append(
    "Set-Cookie",
    `refresh_token=${refreshToken}; HttpOnly; SameSite=Lax; Path=/;`,
  );

  return redirect(redirectTo, { headers });
}

export async function createStaffSession({
  request,
  user,
  remember,
  redirectTo,
}: {
  request: Request;
  user: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);

  // Generate tokens using the payload
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  session.set(STAFF_SESSION_KEY, user); // Store the payload in the session

  // Commit the session to get the session cookie string
  const sessionCookie = await sessionStorage.commitSession(session, {
    maxAge: remember
      ? 60 * 60 * 24 * 7 // 7 days
      : undefined,
  });

  // Create "Set-Cookie" headers for each cookie
  const headers = new Headers();
  headers.append("Set-Cookie", sessionCookie);
  headers.append(
    "Set-Cookie",
    `access_token=${accessToken}; HttpOnly; SameSite=Lax; Path=/;`,
  );
  headers.append(
    "Set-Cookie",
    `refresh_token=${refreshToken}; HttpOnly; SameSite=Lax; Path=/;`,
  );

  return redirect(redirectTo, { headers });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  session.unset("access_token");
  session.unset("refresh_token");

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
