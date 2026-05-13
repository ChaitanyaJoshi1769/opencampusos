import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HealthModule } from './health/health.module';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';
import { PushModule } from './push/push.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    EventEmitterModule.forRoot(),
    HealthModule,
    EmailModule,
    SmsModule,
    PushModule,
  ],
})
export class AppModule {}
