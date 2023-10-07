import axios from 'axios'
import { SearchConfiguration, SearchError, SearchRequest } from '../src/types'
import searchResults from './data/search-results.json'
import { getPlaceAutocomplete } from '../src/maps-api'
import { handleAxiosErrors } from '../src/errors'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('../src/errors')
const mockHandleAxiosErrors = handleAxiosErrors as jest.MockedFunction<typeof handleAxiosErrors>

describe('Map Api', () => {
  describe('getPlaceAutocomplete', () => {
    let searchRequest: SearchRequest
    let configuration: SearchConfiguration

    beforeEach(() => {
      searchRequest = {
        address: 'abc',
        limit: 10,
      }

      configuration = {
        tomTomBaseUrl: 'tomtom.com',
        tomTomFuzzySearchApiVersion: '99',
        tomTomApiKey: 'API-KEY',
        countrySet: 'US',
      }
    })

    describe('Tom Tom Api returns data', () => {
      it('returns results', async () => {
        mockedAxios.get.mockResolvedValue({
          data: searchResults,
        })

        const response = await getPlaceAutocomplete(searchRequest, configuration)

        expect(response).toBeDefined()
        expect(response.errors).toBeUndefined()
        expect(response.results).toBeDefined()

        const results = response.results
        expect(results).toHaveLength(2)

        const oneResult = results![0]
        expect(oneResult).toHaveProperty('placeId')
        expect(oneResult).toHaveProperty('streetNumber')
        expect(oneResult).toHaveProperty('streetName')
        expect(oneResult).toHaveProperty('municipality')
        expect(oneResult).toHaveProperty('countrySubdivision')
        expect(oneResult).toHaveProperty('countrySubdivision')
        expect(oneResult).toHaveProperty('postalCode')
        expect(oneResult).toHaveProperty('country')
        expect(oneResult).toHaveProperty('freeformAddress')

        // Verify TomTom Api called correctly
        expect(axios.get).toHaveBeenCalledTimes(1)

        const url = `https://${configuration.tomTomBaseUrl}/search/${configuration.tomTomFuzzySearchApiVersion}/search/${searchRequest.address}.json`
        expect(axios.get).toHaveBeenCalledWith(url, {
          params: {
            key: configuration.tomTomApiKey,
            limit: searchRequest.limit,
            countrySet: configuration.countrySet,
          },
        })
      })
    })

    describe('Address search characters are not url safe', () => {
      it('Uri encodes the characters before calling TomTom Api', async () => {
        searchRequest.address = 'Charlotte!@#$%^'

        mockedAxios.get.mockResolvedValue({
          data: searchResults,
        })

        const response = await getPlaceAutocomplete(searchRequest, configuration)

        expect(response).toBeDefined()
        expect(response.errors).toBeUndefined()
        expect(response.results).toBeDefined()

        const results = response.results
        expect(results).toHaveLength(2)

        const uriEncodedAddress = encodeURIComponent(searchRequest.address)
        const url = `https://${configuration.tomTomBaseUrl}/search/${configuration.tomTomFuzzySearchApiVersion}/search/${uriEncodedAddress}.json`
        expect(axios.get).toHaveBeenCalledWith(url, {
          params: {
            key: configuration.tomTomApiKey,
            limit: searchRequest.limit,
            countrySet: configuration.countrySet,
          },
        })
      })
    })

    describe('An error occurs', () => {
      it('returns error result', async () => {
        const err = new Error('Boom!')
        const searchError: SearchError = {
          errorStatus: '100',
          errorCode: 'Blah',
          errorText: 'Boom!',
          cause: err,
        }

        mockHandleAxiosErrors.mockReturnValue(searchError)

        mockedAxios.get.mockRejectedValue(err)

        const response = await getPlaceAutocomplete(searchRequest, configuration)

        expect(response).toBeDefined()
        expect(response.results).toBeUndefined()
        expect(response.errors).toBeDefined()
        expect(response.errors).toHaveLength(1)

        const firstError = response.errors![0]

        expect(firstError).toEqual(searchError)
      })
    })
  })
})
