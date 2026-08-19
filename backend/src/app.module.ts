import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { EmailModule } from '@/email/email.module';
import { RecurringPaymentModule } from './recurring-payment/recurring-payment.module';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        SequelizeModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            useFactory: (configService: ConfigService) => ({
                dialect: 'postgres',
                uri: configService.get<string>('DATABASE_URL'),
                autoLoadModels: true,
                synchronize: false,
                logging: false,
                timezone: 'UTC',
            }),
        }),
        AuthModule,
        UserModule,
        EmailModule,
        RecurringPaymentModule,
    ],
})
export class AppModule {}
