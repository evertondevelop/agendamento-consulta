import { StormGlass } from '@src/clients/stormGlass';

export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N',
}

export interface Beach {
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
    user: string;
}

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) {}

    public async processForecastForBeaches(beaches: Beach[]) {}
}
