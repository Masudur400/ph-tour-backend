"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../utlis/catchAsync");
const sentResponse_1 = require("../../utlis/sentResponse");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const setCookie_1 = require("../../utlis/setCookie");
const userTokens_1 = require("../../utlis/userTokens");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
// const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     // const loginInfo = await AuthServices.credentialsLogin(req.body) 
//     passport.authenticate("local", async(err: any, user: any, info: any)=>{
//         if (err) { 
//             return next(new AppError(401, err))
//         }
//          if (!user) { 
//             return next(new AppError(401, info.message))
//         }
//         const userTokens = await createUserToken(user)
//         const { password: pass, ...rest } = user.toObject()
//         setAuthCookie(res, userTokens)
//     sentResponse(res, {
//         success: true,
//         statusCode: httpStatus.OK,
//         message: "User Logged In Successfully",
//         data:  {
//                 accessToken: userTokens.accessToken,
//                 refreshToken: userTokens.refreshToken,
//                 user: rest
//             },
//     })
//     })(req, res, next)
// })
const credentialsLogin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const loginInfo = await AuthServices.credentialsLogin(req.body)
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new appError_1.default(401, err));
        }
        if (!user) {
            return next(new appError_1.default(401, info.message));
        }
        const userTokens = yield (0, userTokens_1.createUserToken)(user);
        // delete user.toObject().password
        const _a = user.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
        (0, setCookie_1.setAuthCookie)(res, userTokens);
        (0, sentResponse_1.sentResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            },
        });
    }))(req, res, next);
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'no refresh token received from cookies');
    }
    const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sentResponse_1.sentResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "new access token retrive Successfully",
        data: tokenInfo,
    });
}));
const logout = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, sentResponse_1.sentResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "User Logged out Successfully",
        data: null,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.resetPassword(oldPassword, newPassword, decodedToken);
    (0, sentResponse_1.sentResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "reset password Successfully",
        data: null,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
    yield auth_service_1.AuthServices.resetPassword(oldPassword, newPassword, decodedToken);
    (0, sentResponse_1.sentResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "reset password Successfully",
        data: null,
    });
}));
const googleCallbackController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    if (!user) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found");
    }
    const tokenInfo = (0, userTokens_1.createUserToken)(user);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    // sentResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "reset password Successfully",
    //     data: null,
    // })
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { password } = req.body;
    yield auth_service_1.AuthServices.setPassword(decodedToken.userId, password);
    (0, sentResponse_1.sentResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password Changed Successfully",
        data: null,
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auth_service_1.AuthServices.forgotPassword(email);
    (0, sentResponse_1.sentResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Email Sent Successfully",
        data: null,
    });
}));
exports.AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    changePassword,
    resetPassword,
    setPassword,
    forgotPassword,
    googleCallbackController
};
