import {getPlaceAutocomplete} from './maps-api'
import {getConfiguration} from "./configuration";
import {SearchRequest, SearchResponse} from "./types";
import {handleAxiosErrors} from "./errors";

export async function getAutoCompleteDetails(request: SearchRequest): Promise<SearchResponse> {
    const configuration = getConfiguration();

    try {
        return getPlaceAutocomplete(request, configuration);
    } catch (err) {
        return {
            errors: [handleAxiosErrors(err)]
        }
    }
}

// const request: SearchRequest = {
//     address: 'Charlotte Street',
//     limit: 1, // max 100
//     // offset: 10
// }
//
// getAutoCompleteDetails(request)
//     .then(res => console.log(res))
//     .catch(e => console.error(e));