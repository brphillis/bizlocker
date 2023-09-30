import jwt from "jsonwebtoken";
import { USER_SESSION_KEY, getSession } from "./session.server";
import { getCookies } from "./helpers/cookieHelpers";

const accessTokenExpiry = "20m";
const refreshTokenExpiry = "7d";
const algorithm = "HS256";

export const generateAccessToken = (user: any) => {
  return jwt.sign({ user }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: accessTokenExpiry,
    algorithm: algorithm,
  });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign({ user }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: refreshTokenExpiry,
    algorithm: algorithm,
  });
};

export const tokenAuth = async (request: Request) => {
  const session = await getSession(request);

  let accessToken, refreshToken;

  const cookies = getCookies(request);

  accessToken = cookies["access_token"];
  refreshToken = cookies["refresh_token"];

  if (accessToken && refreshToken) {
    try {
      // Verify the access token
      jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
      return { valid: true };
    } catch (e: any) {
      if (e instanceof jwt.TokenExpiredError) {
        // If the access token is expired, we verify the refresh token
        try {
          jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

          // If refresh token is valid, we generate a new access token and store it
          const user = session.get(USER_SESSION_KEY);
          const newAccessToken = generateAccessToken(user);
          session.set("access_token", newAccessToken);

          return { valid: true, accessToken: newAccessToken };
        } catch (e: any) {
          // If refresh token is also invalid, we clear the session
          session.unset(USER_SESSION_KEY);
          session.unset("access_token");
          session.unset("refresh_token");

          return { valid: false, error: e.message };
        }
      } else {
        // If access token is invalid for a reason other than expiry, we clear the session
        session.unset(USER_SESSION_KEY);
        session.unset("access_token");
        session.unset("refresh_token");

        return { valid: false, error: e.message };
      }
    }
  } else {
    session.unset(USER_SESSION_KEY);
    session.unset("access_token");
    session.unset("refresh_token");

    return { valid: false, error: "no tokens provided" };
  }
};
