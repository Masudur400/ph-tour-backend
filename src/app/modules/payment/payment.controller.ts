import { Request, Response } from "express";
import { envVars } from "../../config/env"; 
import { catchAsync } from "../../utlis/catchAsync";
import { PaymentService } from "./payment.service";
import { sentResponse } from "../../utlis/sentResponse";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await PaymentService.initPayment(bookingId as string)
    sentResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
});
const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.successPayment(query as Record<string, string>)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});
const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.failPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});
const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await PaymentService.cancelPayment(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

const getInvoiceDownloadUrl = catchAsync(async (req: Request, res: Response) => {
        const { paymentId } = req.params;
        const result = await PaymentService.getInvoiceDownloadUrl(paymentId);
        sentResponse(res, {
            statusCode: 200,
            success: true,
            message: "Invoice download URL retrieved successfully",
            data: result,
        });
    }
);
const validatePayment = catchAsync(async (req: Request, res: Response) => {
        console.log("sslcommerz ipn url body", req.body);
        await SSLService.validatePayment(req.body)
        sentResponse(res, {
            statusCode: 200,
            success: true,
            message: "Payment Validated Successfully",
            data: null,
        });
    }
);

export const PaymentController = {
    initPayment,
    getInvoiceDownloadUrl,
    validatePayment,
    successPayment,
    failPayment,
    cancelPayment,
};