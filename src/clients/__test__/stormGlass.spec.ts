import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios';
import stormGlassWeather3HoursJson from '@test/fixtures/stormGlass-weather-3-hours.json'
import stormGlassNormalized3HoursJson from '@test/fixtures/stormGlass-normalized-3-hours.json'
import * as HTTPUtil from '@src/util/request'

jest.mock('@src/util/request');

describe('StormGlass client', () => {
    const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>
    const lat = -33.7927726;
    const lng = -151.289824;

    it('should return normalized forecast from the StormGlass API', async () => {

        mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursJson } as HTTPUtil.Response)

        const stormGlass = new StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual(stormGlassNormalized3HoursJson)
    })

    it('should be exclude incomplete data points', async () => {
        const incompletePoints = {
            hours: [
                {
                    windDirection: {
                        noaa: 300
                    },
                    time: '2020-04-26T00:00:00'
                }
            ]
        };

        mockedRequest.get.mockResolvedValue({ data: incompletePoints} as HTTPUtil.Response);

        const stormGlass = new StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(lat, lng);

        expect(response).toEqual([]);
    })

    it('should get a generic error from StormGlass service when fail', async () => {
        mockedRequest.get.mockRejectedValue({ message: 'Network Error'});

        const stormGlass = new StormGlass(mockedRequest);
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error when trying to communicate to StormGlass: Network Error'
        )
    })

    it('should get a StormGlassError when exceed rate limit', async () => {
        mockedRequest.get.mockRejectedValue({ response: {
            status: 429,
            data: { "errors" : ["Rate limit reached"]}
        } });

        const stormGlass = new StormGlass(mockedRequest);
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate limit reached"]} Code: 429'
        )
    })
})