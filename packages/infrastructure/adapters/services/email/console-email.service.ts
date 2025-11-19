import {
  EmailService,
  SendEmailOptions,
} from "../../../../application/ports/services/email-service.interface";

export class ConsoleEmailService implements EmailService {
  public async sendEmail({
    to,
    subject,
    text,
  }: SendEmailOptions): Promise<void> {
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`TEXT: ${text}`);
  }
}
