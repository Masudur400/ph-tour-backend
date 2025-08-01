import { Request, Response } from "express";
import { catchAsync } from "../../utlis/catchAsync"; ;
import { DivisionService } from "./division.service";
import { IDivision } from "./division.interface";
import { sentResponse, TMeta } from "../../utlis/sentResponse";


// const createDivision = catchAsync(async (req: Request, res: Response) => {
//     const result = await DivisionService.createDivision(req.body);
//     sentResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: "Division created",
//         data: result,
//     });
// });

const createDivision = catchAsync(async (req: Request, res: Response) => {
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const result = await DivisionService.createDivision(payload);
    sentResponse(res, {
        statusCode: 201,
        success: true,
        message: "Division created",
        data: result,
    });
});

const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
    const result = await DivisionService.getAllDivisions();
    sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
        meta: result.meta as TMeta,
    });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug
    const result = await DivisionService.getSingleDivision(slug);
    sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
    });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }
    const result = await DivisionService.updateDivision(id, payload);
    sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division updated",
        data: result,
    });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
    const result = await DivisionService.deleteDivision(req.params.id);
    sentResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division deleted",
        data: result,
    });
});

export const DivisionController = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};