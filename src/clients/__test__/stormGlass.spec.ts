import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios';
import stormGlassWeather3HoursJson from '@test/fixtures/stormGlass-weather-3-hours.json'
import stormGlassNormalized3HoursJson from '@test/fixtures/stormGlass-normalized-3-hours.json'

jest.mock('axios');

describe('StormGlass client', () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    const lat = -33.7927726;
    const lng = -151.289824;

    it('should return normalized forecast from the StormGlass API', async () => {

        mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursJson })

        const stormGlass = new StormGlass(mockedAxios);
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

        mockedAxios.get.mockResolvedValue({ data: incompletePoints});

        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, lng);

        expect(response).toEqual([]);
    })

    it('should get a generic error from StormGlass service when fail', async () => {
        mockedAxios.get.mockRejectedValue({ message: 'Network Error'});

        const stormGlass = new StormGlass(mockedAxios);
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error when trying to communicate to StormGlass: Network Error'
        )
    })

    it('should get a StormGlassError when exceed rate limit', async () => {
        mockedAxios.get.mockRejectedValue({ response: {
            status: 429,
            data: { "errors" : ["Rate limit reached"]}
        } });

        const stormGlass = new StormGlass(mockedAxios);
        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate limit reached"]} Code: 429'
        )
    })
})