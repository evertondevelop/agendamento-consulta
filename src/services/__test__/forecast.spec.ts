import stormGlassListBeachesJson from '@test/fixtures/stormGlass-list-beaches.json';
import { StormGlass } from '@src/clients/stormGlass';
import { Beach, BeachPosition, Forecast } from '../forecast';

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
    it('should return the forecast for a list of beaches', async () => {
        StormGlass.prototype.fetchPoints = jest
            .fn()
            .mockResolvedValue(stormGlassListBeachesJson);

        const expectedResponse = stormGlassListBeachesJson;
        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
                user: 'some-id',
            },
        ];

        const forecast = new Forecast(new StormGlass());
        const beachesWithRating = await forecast.processForecastForBeaches(
            beaches
        );

        expect(beachesWithRating).toEqual(expectedResponse);
    });
});
