import axios, {AxiosError} from "axios";
import {SearchError} from "./types";

const DEFAULT_ERROR_STATUS = '500';
const DEFAULT_ERROR_CODE = 'Unknown error occurred';
const OTHER_HTTP_STATUS = [403, 404, 405, 429, 596, 500]

export function handleAxiosErrors(err: unknown): SearchError {
    if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        const {response} = error;

        // TomTom Api specific validations errors
        if (response?.status === 400 && response.data) {
            const tomTomHttpStatus = error.response!.data.httpStatusCode;
            const tomTomDetailedError = error.response!.data.detailedError;

            const errorStatus = tomTomHttpStatus?.toString()
            const errorCode = tomTomDetailedError.code
            const errorText = tomTomDetailedError.message

            return {
                errorStatus,
                errorCode,
                errorText,
                cause: error
            }
        }

        // Other Http errors returned from TomTom Api
        if (response?.status && OTHER_HTTP_STATUS.includes(response.status)) {
            return {
                errorStatus: response.status.toString(),
                errorCode: response.statusText,
                errorText: response.statusText,
                cause: error
            }
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