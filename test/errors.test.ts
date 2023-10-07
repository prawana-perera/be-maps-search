import {config} from "dotenv";
import axios, {AxiosError} from 'axios';
import {defaultError, handleAxiosErrors} from "../src/errors";

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

config();

describe('Errors', () => {
    describe('defaultError', () => {
        it('returns default error details', () => {
            const cause = new Error('BOOM!');
            const err = defaultError(cause);

            expect(err).toBeDefined()
            expect(err.errorStatus).toEqual('500')
            expect(err.errorCode).toEqual('Unknown error occurred');
            expect(err.errorText).toEqual('Unknown error occurred');
            expect(err.cause).toEqual(cause);
        })
    })

    describe('handleAxiosErrors', () => {
        describe('non axios errors', () => {
            it('returns a default error', () => {
                const cause = new Error('BOOM!');
                const err = handleAxiosErrors(cause);

                expect(err).toBeDefined()
                expect(err.errorStatus).toEqual('500')
                expect(err.errorCode).toEqual('Unknown error occurred');
                expect(err.errorText).toEqual('Unknown error occurred');
                expect(err.cause).toEqual(cause);
            })
        })

        describe('axios errors', () => {
            let axiosError: AxiosError

            beforeEach(() => {
                mockedAxios.isAxiosError.mockReturnValue(true);

                axiosError = {
                    name: 'AxiosError',
                    message: 'BOOM!',
                    config: {},
                    isAxiosError: true,
                    toJSON: () => ({}),
                    response: {
                        data: {},
                        status: -1,
                        statusText: '-1',
                        headers: {},
                        config: {}
                    },
                }
            });

            describe('general Http errors', () => {
                it.each([
                    [403, 'Forbidden'],
                    [404, 'NotFound'],
                    [405, 'NotAllowed'],
                    [429, 'TooManyRequests'],
                    [596, 'NotFound'],
                    [500, 'Error'],
                ])('returns error for status %i', (status, statusText) => {
                    axiosError.response!.status = status
                    axiosError.response!.statusText = statusText

                    const err = handleAxiosErrors(axiosError);
                    expect(err).toBeDefined()
                    expect(err.errorStatus).toEqual(status.toString())
                    expect(err.errorCode).toEqual(statusText);
                    expect(err.errorText).toEqual(statusText);
                    expect(err.cause).toEqual(axiosError);
                })
            });

            describe('Tom Tom api validation errors', () => {
                it('returns error with api error details', () => {
                    axiosError.response = {
                        data: {
                            httpStatusCode: 400,
                            detailedError: {
                                code: 'BadRequest',
                                message: 'Invalid limit parameter'
                            }
                        },
                        status: 400,
                        statusText: 'BadRequest',
                        headers: {},
                        config: {}
                    }

                    const err = handleAxiosErrors(axiosError);
                    expect(err).toBeDefined()
                    expect(err.errorStatus).toEqual('400')
                    expect(err.errorCode).toEqual('BadRequest');
                    expect(err.errorText).toEqual('Invalid limit parameter');
                    expect(err.cause).toEqual(axiosError);
                })
            })

            describe('Unknown Http error', () => {
                it('returns a default error', () => {
                    const err = handleAxiosErrors(axiosError);

                    expect(err).toBeDefined()
                    expect(err.errorStatus).toEqual('500')
                    expect(err.errorCode).toEqual('Unknown error occurred');
                    expect(err.errorText).toEqual('Unknown error occurred');
                    expect(err.cause).toEqual(axiosError);
                })
            })
        })
    });
})