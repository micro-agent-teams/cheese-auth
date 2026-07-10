/*
 *  Description: This file defines the users module, which is used to send emails.
 *
 *  Author(s):
 *      Nictheboy Li    <nictheboy@outlook.com>
 *
 */

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailRuleService } from './email-rule.service';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRoot({
      //See: https://notiz.dev/blog/send-emails-with-nestjs
      transport: {
        host: process.env.EMAIL_SMTP_HOST,
        port: parseInt(
          process.env.EMAIL_SMTP_PORT ||
            (process.env.EMAIL_SMTP_SSL_ENABLE === 'true' ? '587' : '25'),
        ),
        // EMAIL_SMTP_SSL_ENABLE is a string env var; passing it directly made
        // `secure` truthy for ANY non-empty value (including the literal
        // string "false"), forcing implicit TLS on port 25 and breaking
        // plaintext/STARTTLS delivery. Coerce to a real boolean.
        secure: process.env.EMAIL_SMTP_SSL_ENABLE === 'true',
        auth: {
          user: process.env.EMAIL_SMTP_USERNAME,
          pass: process.env.EMAIL_SMTP_PASSWORD,
        },
      },
      defaults: {
        from: process.env.EMAIL_DEFAULT_FROM,
      },
      template: {
        dir: join(__dirname, '..', 'resources', 'email-templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    ConfigModule,
  ],
  providers: [EmailService, EmailRuleService],
  exports: [EmailService, EmailRuleService],
})
export class EmailModule {}
