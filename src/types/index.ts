export type SearchConfiguration = {
    tomTomBaseUrl: string
    tomTomFuzzySearchApiVersion: string
    tomTomApiKey: string
    countrySet: string
}

export type SearchError = {
    errorStatus: string
    errorCode: string
    errorText: string
    cause: Error | unknown
}

export type SearchRequest = {
    address: string
    limit?: number
}

export type SearchResponse = {
    results?: SearchResults[]
    errors?: SearchError[]
}

export type SearchResults = {
    placeId: string
    streetNumber: string
    streetName: string
    municipality: string
    countrySubdivision: string
    postalCode: string
    country: string
    freeformAddress: string
}

export type TomTomSearchSummary = {
    query: string
    queryType: string
    queryTime: number
    numResults: number
    offset: number
    totalResults: number
    // Other fields not mapped as we are not using yet
}

export type TomTomAddress = {
    streetNumber: string // The building number on the street.
    streetName: string
    municipality: string // City / Town
    countrySubdivision: string // State or Province
    postalCode: string
    country: string
    freeformAddress: string
    // Other fields not mapped as we are not using yet
}

export type TomTomSearchResult = {
    type: string
    id: string
    score: number
    address: TomTomAddress
    // Other fields not mapped as we are not using yet
}

export type TomTomSearchResponse = {
    summary: TomTomSearchSummary
    results: TomTomSearchResult[]
}