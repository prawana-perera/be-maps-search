import {config} from 'dotenv'
import {describe} from '@jest/globals'
import {getAutoCompleteDetails} from '../src'
import {SearchRequest} from "../src/types";

config();

// These are end-to-end tests and need an api key
describe('Tomtom Places E2E Tests', () => {
    describe('getAutoCompleteDetails', () => {
        let searchRequest: SearchRequest;

        beforeEach(() => {
            searchRequest = {
                address: 'Charlotte Street'
            }
        });

        it('returns a promise', () => {
            const res = getAutoCompleteDetails(searchRequest)
            expect(res).toBeInstanceOf(Promise)
        })

        it('can fetch from the autocomplete api', async () => {
            const response = await getAutoCompleteDetails(searchRequest)

            expect(response).not.toBeNull();
            expect(response.results).not.toBeNull();
            expect(response.results).not.toHaveLength(0);

            const firstRes = response.results![0];
            expect(firstRes).toHaveProperty('placeId')
            expect(firstRes).toHaveProperty('streetNumber')
            expect(firstRes).toHaveProperty('streetName')
            expect(firstRes).toHaveProperty('municipality')
            expect(firstRes).toHaveProperty('countrySubdivision')
            expect(firstRes).toHaveProperty('countrySubdivision')
            expect(firstRes).toHaveProperty('postalCode')
            expect(firstRes).toHaveProperty('country')
            expect(firstRes).toHaveProperty('freeformAddress')
        })

        it('can limit number of results', async () => {
            searchRequest.limit = 2
            const response = await getAutoCompleteDetails(searchRequest)

            expect(response).not.toBeNull();
            expect(response.results).not.toBeNull();
            expect(response.results).toHaveLength(2);
        })
    })

    describe('getPlaceAutocomplete', () => {
        it('handles no results', async () => {
            const searchRequest = {
                address: 'asfasffasfasafsafs'
            }

            const response = await getAutoCompleteDetails(searchRequest)
            expect(response).not.toBeNull();
            expect(response.results).toStrictEqual([])
        })

        it('handles error', async () => {
            const searchRequest = {
                address: ''
            }

            const response = await getAutoCompleteDetails(searchRequest)
            expect(response).not.toBeNull();
            expect(response.results).toBeUndefined()
            expect(response.errors).toBeDefined();

            const errors = response.errors;
            expect(errors).toHaveLength(1);

            const error = errors![0];
            expect(error).toHaveProperty('errorStatus')
            expect(error).toHaveProperty('errorCode')
            expect(error).toHaveProperty('errorText')
            expect(error).toHaveProperty('cause')
        })
    })

})
