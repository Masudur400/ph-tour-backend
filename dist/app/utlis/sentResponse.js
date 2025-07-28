"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentResponse = void 0;
const sentResponse = (res, data) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        meta: data === null || data === void 0 ? void 0 : data.meta,
        data: data.data
    });
};
exports.sentResponse = sentResponse;
