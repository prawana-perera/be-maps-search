import axios from 'axios'
import { SearchConfiguration, SearchRequest, SearchResponse, TomTomSearchResponse } from './types'
import { handleAxiosErrors } from './errors'

export async function getPlaceAutocomplete(
  request: SearchRequest,
  configuration: SearchConfiguration,
): Promise<SearchResponse> {
  const { tomTomBaseUrl, tomTomFuzzySearchApiVersion, tomTomApiKey, countrySet } = configuration

  const { address, limit } = request
  const query = encodeURIComponent(address)

  const url = `https://${tomTomBaseUrl}/search/${tomTomFuzzySearchApiVersion}/search/${query}.json'`

  try {
    const autocomplete = await axios.get<TomTomSearchResponse>(url, {
      params: {
        key: tomTomApiKey,
        limit,
        countrySet,
      },
    })

    const { results } = autocomplete.data

    return {
      results: results.map(({ id, address }) => ({
        placeId: id,
        streetNumber: address.streetNumber,
        streetName: address.streetName,
        municipality: address.municipality,
        countrySubdivision: address.countrySubdivision,
        postalCode: address.postalCode,
        country: address.country,
        freeformAddress: address.freeformAddress,
      })),
    }
  } catch (err) {
    return {
      errors: [handleAxiosErrors(err)],
    }
  }
}
