import { sign, verify } from "jsonwebtoken";

type Token = "accessToken" | "refreshToken"

const tokenType = {
    accessToken: {
        privateKey: process.env.ACCESS_TOKEN_KEY ?? "access-token-key",
        expiresIn: process.env.NODE_ENV !== "production" ? "30d" : "15m", // 15m
    },
    refreshToken: {
        privateKey: process.env.REFRESH_TOKEN_KEY ?? "refresh-token-key",
        expiresIn: "7d", // 7d
    },
};

/**
 * Returns token.
 *
 * @remarks
 * This method is part of the {@link utils/jwt}.
 *
 * @param user - 1st input
 * @param type - 2nd input
 *
 * @returns The access token mean of `user`
 *
 * @beta
 */
const generateToken = (user: any, type: Token) => {
    return sign(
        {
            _id: user._id,
        },
        tokenType[type].privateKey,
        {
            issuer: "Chnirt corp",
            subject: user.email,
            audience: "https://github.com/chnirt",
            algorithm: "HS256",
            expiresIn: tokenType[type].expiresIn,
        },
    );
};

/**
 * Returns user by verify token.
 *
 * @remarks
 * This method is part of the {@link utils/jwt}.
 *
 * @param token - 1st input
 * @param type - 2nd input
 *
 * @returns The user mean of `token`
 *
 * @beta
 */
export const verifyToken = (token: string, type: Token) => {
    const decoded: any = verify(token, tokenType[type].privateKey);

    return decoded?._id;
};

/**
 * Returns login response by trade token.
 *
 * @remarks
 * This method is part of the {@link utils/jwt}.
 *
 * @param user - 1st input
 *
 * @returns The login response mean of `user`
 *
 * @beta
 */
export const tradeToken = (user: any) => {
    const accessToken = generateToken(user, "accessToken");
    const refreshToken = generateToken(user, "refreshToken");

    return { accessToken, refreshToken };
};
