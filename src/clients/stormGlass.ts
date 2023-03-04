import { InternalError } from "@src/util/errors/internal-error";
import { AxiosStatic } from "axios";

export interface StormGlassPointSource {
    [key: string]: number;
}

export interface StormGlassPoint {
    readonly time: string;
    readonly waveDirection: StormGlassPointSource;
    readonly swellDirection: StormGlassPointSource;
    readonly swellHeight: StormGlassPointSource;
    readonly swellPeriod: StormGlassPointSource;
    readonly waveHeight: StormGlassPointSource;
    readonly windDirection: StormGlassPointSource;
    readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
    hours: StormGlassPoint[];
}

export interface ForecastPoints {
    time: string;
    waveDirection: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    waveHeight: number;
    windDirection: number;
    windSpeed: number;
}

export class ClientRequestError extends InternalError {
    constructor(message: string) {
        const internalMessage = 'Unexpected error when trying to communicate to StormGlass';
        super(`${internalMessage}: ${message}`);
    }
}

export class StormGlassResponseError extends InternalError {
    constructor(message: string) {
        const internalMessage = 'Unexpected error returned by the StormGlass service';
        super(`${internalMessage}: ${message}`);
    }
}

export class StormGlass {
    readonly stormGlassAPIParamns: string;
    readonly stormGlassAPISource: string;

    constructor(protected request: AxiosStatic) {
        this.stormGlassAPIParamns = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
        this.stormGlassAPISource = 'noaa';
    }

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoints[]> {
        try {
            const response = await this.request.get<StormGlassForecastResponse>(
                `https://api.stormglass.io/v2/weather/point
                    ?paramns=${this.stormGlassAPIParamns}
                    &source=${this.stormGlassAPISource}
                    &end=1592113802
                    &lat=${lat}
                    &lng=${lng}`
            );

            return this.normalizedResponse(response.data);
        } catch (error: any) {
            if (error.response && error.response.status) {
                throw new StormGlassResponseError(`Error: ${JSON.stringify(error.response.data)} Code: ${error.response.status}`);
            }

            throw new ClientRequestError(error.message);
        }
    }

    private normalizedResponse(points: StormGlassForecastResponse): ForecastPoints[] {
        return points.hours.filter(point => this.isValidPoint(point, [
            'time',
            'waveDirection',
            'swellDirection',
            'swellHeight',
            'swellPeriod',
            'waveHeight',
            'windDirection',
            'windSpeed'
        ])).map((pointFiltered) => ({
            swellPeriod: pointFiltered.swellPeriod[this.stormGlassAPISource],
            swellDirection: pointFiltered.swellDirection[this.stormGlassAPISource],
            swellHeight: pointFiltered.swellHeight[this.stormGlassAPISource],
            waveDirection: pointFiltered.waveDirection[this.stormGlassAPISource],
            waveHeight: pointFiltered.waveHeight[this.stormGlassAPISource],
            windDirection: pointFiltered.windDirection[this.stormGlassAPISource],
            windSpeed: pointFiltered.windSpeed[this.stormGlassAPISource],
            time: pointFiltered.time
        } as ForecastPoints));
    }

    private isValidPoint(point: Partial<StormGlassPoint>, props: string[]): boolean {
        return props.every(prop => point.hasOwnProperty(prop))
    }
}