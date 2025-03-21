import { Global, Module } from '@nestjs/common';
import { timezoneConfig } from './timezone.config';

@Global()
@Module({
    providers: [
        {
            provide: 'TIMEZONE_CONFIG',
            useValue: timezoneConfig,
        },
    ],
    exports: ['TIMEZONE_CONFIG'],
})
export class TimezoneModule { }