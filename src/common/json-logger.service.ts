import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger extends ConsoleLogger {
  log(message: any, context?: string) {
    if (process.env.NODE_ENV === 'production') {
      this.printJson('info', message, context);
    } else {
      super.log(message, context);
    }
  }

  error(message: any, stack?: string, context?: string) {
    if (process.env.NODE_ENV === 'production') {
      this.printJson('error', message, context, stack);
    } else {
      super.error(message, stack, context);
    }
  }

  warn(message: any, context?: string) {
    if (process.env.NODE_ENV === 'production') {
      this.printJson('warn', message, context);
    } else {
      super.warn(message, context);
    }
  }

  debug(message: any, context?: string) {
    if (process.env.NODE_ENV === 'production') {
      this.printJson('debug', message, context);
    } else {
      super.debug(message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (process.env.NODE_ENV === 'production') {
      this.printJson('verbose', message, context);
    } else {
      super.verbose(message, context);
    }
  }

  private printJson(level: string, message: any, context?: string, stack?: string) {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      context: context || 'Application',
      message: typeof message === 'object' ? message : String(message),
      ...(stack && { stack }),
    };
    console.log(JSON.stringify(payload));
  }
}
