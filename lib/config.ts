/**
 * Centralized Environment Configuration
 *
 * Pattern: Configuration Object + Fail-Fast
 *
 * All environment variables are validated in ONE place.
 * If a required variable is missing, the app refuses to start
 * with a clear error message — instead of silently failing later.
 *
 * This is how companies like Netflix, Google, and Amazon manage
 * configuration: validate early, fail loudly, never use unsafe defaults.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[Config] Missing required environment variable: "${name}". ` +
      `Please set it in your .env file or Docker environment.`
    );
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

/**
 * App configuration — single source of truth for all env vars.
 * Using a getter function ensures lazy evaluation:
 * values are only read when first accessed (at request time),
 * not at build time — which is what makes Docker builds safe.
 */
export function getConfig() {
  return {
    mongodb: {
      uri: requireEnv('MONGODB_URI'),
      dbName: 'fittrackerDB',
    },
    jwt: {
      secret: requireEnv('JWT_SECRET'),
      expiresIn: '7d' as const,
    },
    groq: {
      apiKey: requireEnv('GROQ_API_KEY'),
    },
    app: {
      nodeEnv: optionalEnv('NODE_ENV', 'development'),
      apiUrl: optionalEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),
    },
  };
}

// Type export for use in typed contexts
export type AppConfig = ReturnType<typeof getConfig>;
