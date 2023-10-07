import axios, {AxiosError} from "axios";
import {SearchError} from "./types";

const DEFAULT_ERROR_STATUS = '500';
const DEFAULT_ERROR_CODE = 'Unknown error occurred';

export function handleAxiosErrors(err: unknown): SearchError {
    if (axios.isAxiosError(err)) {
        const error = err as AxiosError;

        // TomTom Specific Error, if present
        const tomTomHttpStatus = error.response?.data.httpStatusCode;
        const tomTomDetailedError = error.response?.data.detailedError;

        const errorStatus = tomTomHttpStatus || DEFAULT_ERROR_STATUS
        const errorCode = tomTomDetailedError.code || error.response?.status.toString() || DEFAULT_ERROR_CODE
        const errorText = tomTomDetailedError.message || error.response?.statusText || DEFAULT_ERROR_CODE

        return {
            errorStatus,
            errorCode,
            errorText,
            cause: error
        }
    }

    return defaultError(err)
}

export function defaultError(err: unknown): SearchError {
    return {
        errorStatus: DEFAULT_ERROR_STATUS,
        errorCode: DEFAULT_ERROR_CODE,
        errorText: DEFAULT_ERROR_CODE,
        cause: err
    }
}