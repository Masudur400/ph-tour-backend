"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../user/user.model");
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const radis_config_1 = require("../../config/radis.config");
const sendEmail_1 = require("../../utlis/sendEmail");
const OTP_EXPIRATION = 2 * 60; // 2minute
const generateOtp = (length = 6) => {
    //6 digit otp
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    // 10 ** 5 => 10 * 10 *10 *10 *10 * 10 => 1000000
    return otp;
};
const sendOTP = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    if (user.isVerified) {
        throw new appError_1.default(401, "You are already verified");
    }
    const otp = generateOtp();
    const redisKey = `otp:${email}`;
    yield radis_config_1.redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    });
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    });
});
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await User.findOne({ email, isVerified: false })
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(404, "User not found");
    }
    if (user.isVerified) {
        throw new appError_1.default(401, "You are already verified");
    }
    const redisKey = `otp:${email}`;
    const savedOtp = yield radis_config_1.redisClient.get(redisKey);
    if (!savedOtp) {
        throw new appError_1.default(401, "Invalid OTP");
    }
    if (savedOtp !== otp) {
        throw new appError_1.default(401, "Invalid OTP");
    }
    yield Promise.all([
        user_model_1.User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        radis_config_1.redisClient.del([redisKey])
    ]);
});
exports.OTPService = {
    sendOTP,
    verifyOTP
};
