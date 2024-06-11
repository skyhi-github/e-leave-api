import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ELeaveModule } from './modules/e-leave/e-leave.module';
import 'dotenv/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: Boolean(process.env.DB_SYNC),
    }),
    ELeaveModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.hostinger.com',
        port: Number('587'),
        secure: false,
        debug: true,
        connectionTimeout: 10000,
        auth: {
          user: 'admin@manozagahostinger.online', // Your email address
          pass: '@Manozaga0', // Your email password
        },
      },})
  ],
})
export class MainModule {}
