import { SearchConfiguration } from './types'

export function getConfiguration(): SearchConfiguration {
  return {
    tomTomApiKey: process.env.TOMTOM_API_KEY as string,
    tomTomBaseUrl: (process.env.TOMTOM_BASE_URL as string) || 'api.tomtom.com',
    tomTomFuzzySearchApiVersion: '2',
    countrySet: 'AU',
  }
}
