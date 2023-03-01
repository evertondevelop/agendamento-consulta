import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/forecastController';
import './util/module-alias'

export class SetupServer extends Server {
    constructor(private port = 3000) {
        super();
    }

    public init(): void {
        this.setupExpress();
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json())

        this.addControllers(
            [
                new ForecastController()
            ]
        );

        this.app.listen(this.port)
    }
}