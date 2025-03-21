import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor() { }

  setContext(context: string) {
    this.context = context;
  }

  /**
   * Write a 'log' level log, for general information
   */
  log(message: any, context?: string) {
    this.printMessage(message, 'LOG', context);
  }

  /**
   * Write an 'error' level log, for error information
   */
  error(message: any, trace?: string, context?: string) {
    this.printMessage(message, 'ERROR', context);
    if (trace) {
      console.error(trace);
    }
  }

  /**
   * Write a 'warn' level log, for warning information
   */
  warn(message: any, context?: string) {
    this.printMessage(message, 'WARN', context);
  }

  /**
   * Write a 'debug' level log, for debug information
   */
  debug(message: any, context?: string) {
    this.printMessage(message, 'DEBUG', context);
  }

  /**
   * Write a 'verbose' level log, for verbose information
   */
  verbose(message: any, context?: string) {
    this.printMessage(message, 'VERBOSE', context);
  }

  private printMessage(message: any, level: string, context?: string) {
    const timestamp = new Date().toISOString();
    const contextMessage = context || this.context || '';
    const formattedMessage = this.formatMessage(message);
  }

  private formatMessage(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return message;
  }
}