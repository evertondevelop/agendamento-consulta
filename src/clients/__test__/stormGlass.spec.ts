import { StormGlass } from '@src/clients/stormGlass'
import axios from 'axios';
import stormGlassWeather3HoursJson from '@test/fixtures/stormGlass-weather-3-hours.json'
import stormGlassNormalized3HoursJson from '@test/fixtures/stormGlass-normalized-3-hours.json'

jest.mock('axios');

describe('StormGlass client', () => {
    it('should return normalized forecast from the StormGlass API', async () => {
        const lat = -33.7927726;
        const lng = -151.289824;

        axios.get = jest.fn().mockResolvedValue(stormGlassWeather3HoursJson)

        const stormGlass = new StormGlass(axios);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual(stormGlassNormalized3HoursJson)
    })
})