import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { EmailModule } from '@/email/email.module';
import { RecurringPaymentModule } from './recurring-payment/recurring-payment.module';

@Module({
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
