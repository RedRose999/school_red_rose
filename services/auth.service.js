const { PrismaClient, Prisma } = require("@prisma/client");
const { OAuth2Client } = require("google-auth-library");
const {
	encryptPassword,
	generatePassword,
	comparePassword,
} = require("../utils/passwordGenerator");
const jwtService = require("./jwt.service");
const emailService = require("./email.service");
const config = require("../utils/config");
const { USER_STATUS } = require("../constants/app.constants");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utils/errorHandler");
const status = require("http-status");
const Debug = require("debug");
const debug = Debug("auth-service");
const prisma = new PrismaClient();

const googleClientId = config.googleClientId;
const googleClientSecret = config.googleClientSecret;
const client = new OAuth2Client(googleClientId, googleClientSecret);

/**
 * verifies the token with google
 * @param {*} token
 * @returns
 */
async function verifyGoogleToken(token) {
	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: googleClientId,
		});
		return { payload: ticket.getPayload() };
	} catch (error) {
		return { error: "Invalid user detected. Please try again" };
	}
}

/**
 * signup user with google authentication
 * @param {*} cred
 * @returns
 */
async function googleSignup(cred) {
	try {
		const verificationResponse = await verifyGoogleToken(cred);

		if (verificationResponse.error) {
			throw new Error(verificationResponse.error);
		}

		const profile = verificationResponse?.payload;

		const newUser = await prisma.tblUser.create({
			data: {
				firstName: profile.given_name,
				lastName: profile.given_name,
				userStatus: USER_STATUS.active,
			},
			credential: {
				create: [{ email: profile.email }],
			},
			include: {
				tblCredential: true,
			},
		});
		// create email with new user's credentials
		return {
			user: newUser,
			token: jwtService.createToken(newUser),
		};
	} catch (error) {
		throw error;
	}
}
/**
 * service to create new user
 * @param {{ email: String, password: String}} userDetails
 */
async function signup(userDetails) {
	try {
		// add user logic

		const existingUser = await prisma.tblCredential.findUnique({
			where: { email: userDetails.email },
			include: {
				user: true,
			},
		});
		debug(existingUser, userDetails);
		if (existingUser) {
			throw new ApiError({
				message:
					"Email already exists. Please try again with a new email address.",
				statusCode: status.CONFLICT,
			});
		}

		const newUser = await prisma.tblUser.create({
			data: {
				userId: uuidv4(),
				tblCredential: {
					create: {
						password: encryptPassword(userDetails.password),
						email: userDetails.email,
					},
				},
			},
			include: { tblCredential: true },
		});
		// create email with new user's credentials
		return {
			user: newUser,
			token: jwtService.createToken(newUser),
		};
	} catch (error) {
		throw error;
	}
}

/**
 * login with google credentails
 * @param {*} credentials
 * @returns
 */
async function googleSignin(credentials) {
	try {
		const verificationResponse = await verifyGoogleToken(credentials);
		if (verificationResponse.error) {
			throw new Error(verificationResponse.error);
		}
		const profile = verificationResponse?.payload;
		const existingUser = await prisma.tblUser.findUnique({
			where: { credential: { email: profile.email } },
			include: {
				credential: {
					select: { email: true, password: true, createdAt: true },
				},
			},
		});
		if (!existingUser) {
			throw new ApiError({
				message: "User does not exist",
				statusCode: status.NOT_FOUND,
			});
		}
		return {
			user: existingUser,
			token: jwtService.createToken(existingUser),
		};
	} catch (error) {
		throw error;
	}
}

/**
 * login user to the system
 * @param {{email: String, password: String}} userDetails
 * @returns
 */
async function signin(userDetails) {
	try {
		const existingUser = await prisma.tblCredential.findUnique({
			where: { email: userDetails.email },
			include: {
				user: true,
			},
		});
		if (!existingUser) {
			throw new ApiError({
				message: "User not found",
				statusCode: status.NOT_FOUND,
			});
		}
		if (comparePassword(userDetails.password, existingUser.password)) {
			//generate jwt and login
			return {
				user: {
					...existingUser.user,
					createdAt: existingUser.createdAt,
				},
				token: jwtService.createToken(existingUser),
			};
		} else {
			throw new ApiError({
				message: "Password does not match",
				statusCode: status.UNAUTHORIZED,
			});
		}
	} catch (error) {
		throw error;
	}
}

/**
 * forgot password service, changes the password and returns new password
 * @param {{id: String}} userDetails
 * @returns
 */
async function forgotPassword(userDetails) {
	try {
		//generate random Password
		const password = generatePassword();
		const existingUser = await prisma.tblUser.findUnique({
			where: {
				userId: userDetails.userId,
			},
			include: { tblCredential: true },
		});

		const updatedUser = await prisma.tblCredential.update({
			where: {
				userId: userDetails.userId,
			},
			data: {
				password: encryptPassword(userDetails.newPassword),
			},
		});
		email = existingUser.tblCredential.email;

		return { password, email };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

/**
 * updates new password if old one matches
 * @param {{userId: String,oldPassword: String, newPassword: String}} userDetails
 * @returns
 */
async function changePassword(userDetails) {
	try {
		const existingUser = await prisma.tblCredential.findUnique({
			where: { userId: userDetails.userId },
		});

		if (!comparePassword(userDetails.oldPassword, existingUser.password)) {
			throw new ApiError({
				message: "old password does not match",
				statusCode: status.UNAUTHORIZED,
			});
		}

		const updatedUser = await prisma.tblCredential.update({
			where: {
				userId: userDetails.userId,
			},
			data: {
				password: encryptPassword(userDetails.newPassword),
			},
		});

		return updatedUser;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	signin,
	changePassword,
	signup,
	forgotPassword,
	googleSignin,
	googleSignup,
};
