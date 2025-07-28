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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionController = void 0;
const catchAsync_1 = require("../../utlis/catchAsync");
;
const division_service_1 = require("./division.service");
const sentResponse_1 = require("../../utlis/sentResponse");
// const createDivision = catchAsync(async (req: Request, res: Response) => {
//     const result = await DivisionService.createDivision(req.body);
//     sentResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: "Division created",
//         data: result,
//     });
// });
const createDivision = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const result = yield division_service_1.DivisionService.createDivision(payload);
    (0, sentResponse_1.sentResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Division created",
        data: result,
    });
}));
const getAllDivisions = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_service_1.DivisionService.getAllDivisions();
    (0, sentResponse_1.sentResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleDivision = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const result = yield division_service_1.DivisionService.getSingleDivision(slug);
    (0, sentResponse_1.sentResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
    });
}));
const updateDivision = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const result = yield division_service_1.DivisionService.updateDivision(id, payload);
    (0, sentResponse_1.sentResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Division updated",
        data: result,
    });
}));
const deleteDivision = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield division_service_1.DivisionService.deleteDivision(req.params.id);
    (0, sentResponse_1.sentResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Division deleted",
        data: result,
    });
}));
exports.DivisionController = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};
