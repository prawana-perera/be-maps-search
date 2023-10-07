import {config} from "dotenv";
import {getConfiguration} from "../src/configuration";

config();

describe('Configuration', () => {
    describe('getConfiguration', () => {
        it('returns SearchConfiguration', () => {
            const configuration = getConfiguration();

            expect(configuration).toBeDefined()
            expect(configuration).toHaveProperty('tomTomApiKey')
            expect(configuration.tomTomBaseUrl).toEqual('api.tomtom.com');
            expect(configuration.countrySet).toEqual('AU');
            expect(configuration.tomTomFuzzySearchApiVersion).toEqual('2');
        })
    })
})