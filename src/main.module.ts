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
    TypeOrmModule.forRoot({
      name: 'hris',
      type: 'mssql',
      host: process.env.HRIS_DB_HOST,
      port: parseInt(process.env.HRIS_DB_PORT),
      username: process.env.HRIS_DB_USERNAME,
      password: process.env.HRIS_DB_PASSWORD,
      database: process.env.HRIS_DB_DATABASE,
      synchronize: Boolean(process.env.HRIS_DB_SYNC),
      extra: {
        trustServerCertificate: true,
      }
    }),
    ELeaveModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.hostinger.com',
        port: 587,
        secure: false,
        debug: true,
        connectionTimeout: 10000,
        auth: {
          user: 'e-leave@bca-daily.com',
          pass: '@Manozaga0',
        },
      },})
  ],
})
export class MainModule {}
