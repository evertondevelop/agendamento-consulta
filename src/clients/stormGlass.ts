import { AxiosStatic } from "axios";

export class StormGlass {
    readonly stormGlassAPIParamns: string;
    readonly stormGlassAPISource: string;

    constructor(protected request: AxiosStatic) {
        this.stormGlassAPIParamns = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection';
        this.stormGlassAPISource = 'noaa';
    }

    public async fetchPoints(lat: number, lng: number) {
        return this.request.get(
            `https://api.stormglass.io/v2/weather/point
                ?paramns=${this.stormGlassAPIParamns}
                &source=${this.stormGlassAPISource}
                &end=1592113802
                &lat=${lat}
                &lng=${lng}`
        );
    }
}