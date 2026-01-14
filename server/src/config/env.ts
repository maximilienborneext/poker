import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  clientPort: parseInt(process.env.CLIENT_PORT || '5173', 10),
  dbPortExternal: parseInt(process.env.DB_PORT_EXTERNAL || '5435', 10),
  dbPortInternal: parseInt(process.env.DB_PORT_INTERNAL || '5432', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5435/pointing_poker',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jira: {
    baseUrl: process.env.JIRA_BASE_URL || '',
    email: process.env.JIRA_EMAIL || '',
    apiToken: process.env.JIRA_API_TOKEN || '',
  },
};
