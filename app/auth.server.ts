import jwt from "jsonwebtoken";
import { USER_SESSION_KEY, getSession } from "./session.server";
import { getCookies } from "./helpers/cookieHelpers";

const accessTokenExpiry = "20m";
const refreshTokenExpiry = "7d";
const algorithm = "HS256";

export const generateAccessToken = (stringifiedUser: string) => {
  return jwt.sign({ stringifiedUser }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: accessTokenExpiry,
    algorithm: algorithm,
  });
};

export const generateRefreshToken = (stringifiedUser: string) => {
  return jwt.sign({ stringifiedUser }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: refreshTokenExpiry,
    algorithm: algorithm,
  });
};

export const tokenAuth = async (
  request: Request,
  sessionKey: string = USER_SESSION_KEY,
) => {
  const session = await getSession(request);

  const cookies = getCookies(request);

  const accessToken = cookies?.["access_token"];
  const refreshToken = cookies?.["refresh_token"];

  if (accessToken && refreshToken) {
    try {
      // Verify the access token
      jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
      return { valid: true };
    } catch (e: unknown) {
      if (e instanceof jwt.TokenExpiredError) {
        // If the access token is expired, we verify the refresh token
        try {
          jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

          // If refresh token is valid, we generate a new access token and store it
          const user = session.get(sessionKey);
          const newAccessToken = generateAccessToken(user);
          session.set("access_token", newAccessToken);

          return { valid: true, accessToken: newAccessToken };
        } catch (e: unknown) {
          // If refresh token is also invalid, we clear the session
          console.log("NO AUTH.");
          session.unset(sessionKey);
          session.unset("access_token");
          session.unset("refresh_token");

          return { valid: false, error: (e as CatchError).message };
        }
      } else {
        // If access token is invalid for a reason other than expiry, we clear the session
        console.log("NO AUTH.");
        session.unset(sessionKey);
        session.unset("access_token");
        session.unset("refresh_token");

        return { valid: false, error: (e as CatchError).message };
      }
    }
  } else {
    console.log("NO AUTH.");
    session.unset(sessionKey);
    session.unset("access_token");
    session.unset("refresh_token");

    return { valid: false, error: "no tokens provided" };
  }
};
