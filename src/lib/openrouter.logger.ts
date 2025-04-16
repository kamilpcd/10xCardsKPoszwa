type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_FIELDS = [
  'apiKey',
  'token',
  'password',
  'secret',
  'authorization',
  'Authorization',
  'Bearer'
];

export class OpenRouterLogger {
  constructor(private readonly context: string = 'OpenRouter') {}

  private maskSensitiveData(data: unknown): unknown {
    if (typeof data === 'string') {
      // Maskuj wrażliwe dane w stringach
      let maskedData = data;
      SENSITIVE_FIELDS.forEach(field => {
        const regex = new RegExp(`(["']?${field}["']?\\s*[:=]\\s*["']?)[^"'\\s]+(["']?)`, 'gi');
        maskedData = maskedData.replace(regex, '$1********$2');
      });
      return maskedData;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.maskSensitiveData(item));
    }

    if (data && typeof data === 'object') {
      const maskedObj: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          maskedObj[key] = '********';
        } else {
          maskedObj[key] = this.maskSensitiveData(value);
        }
      }
      return maskedObj;
    }

    return data;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const maskedData = data ? this.maskSensitiveData(data) : undefined;
    const dataString = maskedData ? `\n${JSON.stringify(maskedData, null, 2)}` : '';
    
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}${dataString}`;
  }

  debug(message: string, data?: unknown): void {
    console.debug(this.formatMessage('debug', message, data));
  }

  info(message: string, data?: unknown): void {
    console.info(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, error?: Error | unknown): void {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        }
      : error;
    
    console.error(this.formatMessage('error', message, errorData));
  }
} 