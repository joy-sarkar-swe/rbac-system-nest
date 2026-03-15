/**
 * @fileoverview Centralized application configuration.
 *
 * Loads environment variables from `.env` using `dotenv` and
 * exposes them as a strongly-typed, frozen configuration object.
 * Every service in the monorepo should import config from here
 * instead of reading `process.env` directly.
 */

import dotenv from 'dotenv';

dotenv.config();

/** Strongly-typed shape of the application configuration. */
interface AppConfig {
  /** Port the API Gateway listens on. */
  PORT: number;

  /** JWT token lifetime in seconds (default: 30 days). */
  JWT_EXPIRES_IN: number;
  /** Secret key used to sign JWT tokens. */
  JWT_SECRET: string;

  /** bcrypt salt rounds for password hashing. */
  BCRYPT_SALT_ROUNDS: number;

  /** SMTP host for outgoing emails. */
  MAIL_HOST: string;
  /** SMTP port. */
  MAIL_PORT: number;
  /** SMTP authentication username. */
  MAIL_USER: string;
  /** SMTP authentication password / app password. */
  MAIL_PASS: string;
  /** Display name used in the `From` header. */
  MAIL_FROM_NAME: string;
  /** Email address used in the `From` header. */
  MAIL_FROM_EMAIL: string;

  /** Database connection URI. */
  DB_URI: string;
}

/**
 * Reads a single environment variable and parses it as an integer.
 *
 * @param key - Name of the environment variable.
 * @returns The parsed integer value, or `NaN` if the variable is missing.
 */
const int = (key: string): number => parseInt(process.env[key] as string, 10);

/**
 * Reads a single environment variable as a string.
 *
 * @param key - Name of the environment variable.
 * @returns The raw string value.
 */
const str = (key: string): string => process.env[key] as string;

/** Application-wide configuration object. */
const config: AppConfig = {
  PORT: int('PORT'),

  JWT_EXPIRES_IN: int('JWT_EXPIRES_IN'),
  JWT_SECRET: str('JWT_SECRET'),

  BCRYPT_SALT_ROUNDS: int('BCRYPT_SALT_ROUNDS'),

  MAIL_HOST: str('MAIL_HOST'),
  MAIL_PORT: int('MAIL_PORT'),
  MAIL_USER: str('MAIL_USER'),
  MAIL_PASS: str('MAIL_PASS'),
  MAIL_FROM_NAME: str('MAIL_FROM_NAME'),
  MAIL_FROM_EMAIL: str('MAIL_FROM_EMAIL'),

  DB_URI: str('DB_URI'),
};

export default config;
