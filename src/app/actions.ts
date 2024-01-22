"use server";
import { ZodError, ZodIssue, z } from "zod";
import { LoginSchema, RegisterSchema } from "../../schemas";
import prisma from "../../prisma/client";
import { comparePassword, hashPassword } from "@/lib/bcrypt";
import { tradeToken } from "@/lib/jwt";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    try {
        const validatedFields = LoginSchema.safeParse(values);
        // Return early if the form data is invalid
        if (!validatedFields.success) {
            return {
                // errors: validatedFields.error.flatten().fieldErrors,
                error: formatZodError(validatedFields.error),
            };
        }

        const foundUser = await prisma.user.findUnique({
            where: {
                email: values.email
            },
        });

        if (!foundUser) {
            throw new Error("Email or Password don't match");
        }

        const hashedPassword = foundUser.password;
        const compare = await comparePassword(values.password, hashedPassword);

        if (!compare) {
            throw new Error("Email or Password don't match");
        }

        const { accessToken, refreshToken } = await tradeToken(foundUser);

        return {
            data: {
                access_token: accessToken,
                refresh_token: refreshToken,
            },
            message: "User login successfully",
        };
    } catch (error) {
        throw error;
    }
};

const formatZodIssue = (issue: ZodIssue): string => {
    const { path, message } = issue;
    const pathString = path.join(".");

    console.log(issue);

    return `${pathString}: ${message}`;
};

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError): string | undefined => {
    const { issues } = error;

    if (issues.length) {
        const currentIssue = issues[0];

        return formatZodIssue(currentIssue);
    }
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        const validatedFields = RegisterSchema.safeParse(values);
        if (!validatedFields.success) {
            return {
                error: formatZodError(validatedFields.error),
            };
        }

        const existedUser = await prisma.user.findUnique({
            where: {
                email: values.email,
            },
        });

        if (existedUser) {
            throw new Error("Email is existed");
        }

        const data = {
            email: values.email,
            password: await hashPassword(values.password),
        };

        const createdUser = await prisma.user.create({
            data,
        });

        return {
            data: { createdUser },
            message: "User is created",
        };
    } catch (error) {
        throw error;
    }
};
