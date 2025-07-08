// _libs - private folder, not accessible from the client
// keeps logic separate from the routing layer

import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
