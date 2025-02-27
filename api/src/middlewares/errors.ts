import { Request, Response, NextFunction } from "express";
import { HttpException } from "../utils/exceptions";

export const errorMiddleware = (error: HttpException, req:Request, res:Response, next:NextFunction) => {

    if(!error.message){
        error.message = "fatal error : errorMiddleware no error message attributed"
    }
    if(!error.errorCode){
        error.message = "UNKNOWN_ERROR";
    }    
    if(!error.statusCode){
        error.statusCode = 500;
    }    

    res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode,
        errors: error.errors
    })
}