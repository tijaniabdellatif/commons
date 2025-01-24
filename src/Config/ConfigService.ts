export type ConfigSchema = {
  [key: string]: {
    required: boolean;
    defaultValue?: string;
  };
};

export class ConfigService {
  private static instance: ConfigService;
  private config: Record<string, string> = {};

  private constructor(schema: ConfigSchema) {
    this.loadConfig(schema);
  }

  public static getInstance(schema?: ConfigSchema): ConfigService {
    if (!ConfigService.instance) {
      if (!schema) {
        throw new Error('Config schema is required');
      }

      ConfigService.instance = new ConfigService(schema);
    }

    return ConfigService.instance;
  }

  private loadConfig(schema: ConfigSchema): void {
    for (const key in schema) {
      const { required, defaultValue } = schema[key];
      const value = process.env[key];

      if (required && !value && !defaultValue) {
        throw new Error(`Missing required configuration: ${key}`);
      }

      this.config[key] = value || defaultValue || '';
    }
  }

  public get(key: string): string {
    if (!this.config[key]) {
      throw new Error(`Configuration key not found: ${key}`);
    }
    return this.config[key];
  }
}
