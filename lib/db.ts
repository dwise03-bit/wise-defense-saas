import { Pool, PoolClient, QueryResult } from 'pg';

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:YourPassword@localhost:5432/wise_defense',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Execute a query against the database
 */
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error, { text, params });
    throw error;
  }
}

/**
 * Execute a transaction with multiple queries
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get user by email
 */
export async function getUser(email: string) {
  const result = await query(
    `SELECT id, email, password_hash, first_name, last_name, phone, is_active, created_at, updated_at
     FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number) {
  const result = await query(
    `SELECT id, email, password_hash, first_name, last_name, phone, is_active, created_at, updated_at
     FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

/**
 * Create a new user
 */
export async function createUser(
  email: string,
  passwordHash: string,
  firstName?: string,
  lastName?: string,
  phone?: string
) {
  const result = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, first_name, last_name, phone, is_active, created_at, updated_at`,
    [email, passwordHash, firstName, lastName, phone]
  );
  return result.rows[0];
}

/**
 * Get membership tiers (tier pricing lookup)
 * Returns an object mapping tier names to their price in cents
 */
export function getMembershipTiers(): Record<string, number> {
  return {
    free: 0,
    pro: 9900, // $99/month
    enterprise: 29900, // $299/month
  };
}

/**
 * Get user's membership
 */
export async function getUserMembership(userId: number) {
  const result = await query(
    `SELECT id, user_id, tier, status, price_cents, billing_cycle, renewal_date, created_at, updated_at
     FROM memberships WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

/**
 * Create a membership for a user
 */
export async function createMembership(
  userId: number,
  tier: 'free' | 'pro' | 'enterprise',
  priceCents: number,
  billingCycle: 'monthly' | 'annual' = 'monthly',
  renewalDate?: Date
) {
  const result = await query(
    `INSERT INTO memberships (user_id, tier, status, price_cents, billing_cycle, renewal_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, tier, status, price_cents, billing_cycle, renewal_date, created_at, updated_at`,
    [userId, tier, 'active', priceCents, billingCycle, renewalDate]
  );
  return result.rows[0];
}

/**
 * Update membership status
 */
export async function updateMembershipStatus(membershipId: number, status: string) {
  const result = await query(
    `UPDATE memberships SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, user_id, tier, status, price_cents, billing_cycle, renewal_date, created_at, updated_at`,
    [status, membershipId]
  );
  return result.rows[0];
}

/**
 * Create a training session
 */
export async function createSession(
  instructorId: number,
  title: string,
  description?: string,
  scheduledTime?: Date,
  durationMinutes?: number,
  studentIds: number[] = []
) {
  const result = await query(
    `INSERT INTO sessions (instructor_id, title, description, scheduled_time, duration_minutes, student_ids, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, instructor_id, title, description, scheduled_time, duration_minutes, student_ids, status, recording_url, created_at, updated_at`,
    [instructorId, title, description, scheduledTime, durationMinutes, studentIds, 'scheduled']
  );
  return result.rows[0];
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: number) {
  const result = await query(
    `SELECT id, instructor_id, title, description, scheduled_time, duration_minutes, student_ids, status, recording_url, created_at, updated_at
     FROM sessions WHERE id = $1`,
    [sessionId]
  );
  return result.rows[0] || null;
}

/**
 * Update session recording URL
 */
export async function updateSessionRecordingUrl(sessionId: number, recordingUrl: string) {
  const result = await query(
    `UPDATE sessions SET recording_url = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, instructor_id, title, description, scheduled_time, duration_minutes, student_ids, status, recording_url, created_at, updated_at`,
    [recordingUrl, sessionId]
  );
  return result.rows[0];
}

/**
 * Create a payment record
 */
export async function createPayment(
  membershipId: number,
  userId: number,
  amountCents: number,
  paymentMethod?: string,
  externalTransactionId?: string
) {
  const result = await query(
    `INSERT INTO payments (membership_id, user_id, amount_cents, currency, status, payment_method, external_transaction_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, membership_id, user_id, amount_cents, currency, status, payment_method, external_transaction_id, transaction_date, created_at, updated_at`,
    [membershipId, userId, amountCents, 'USD', 'pending', paymentMethod, externalTransactionId]
  );
  return result.rows[0];
}

/**
 * Get payment by ID
 */
export async function getPayment(paymentId: number) {
  const result = await query(
    `SELECT id, membership_id, user_id, amount_cents, currency, status, payment_method, external_transaction_id, transaction_date, created_at, updated_at
     FROM payments WHERE id = $1`,
    [paymentId]
  );
  return result.rows[0] || null;
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(paymentId: number, status: string) {
  const result = await query(
    `UPDATE payments SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, membership_id, user_id, amount_cents, currency, status, payment_method, external_transaction_id, transaction_date, created_at, updated_at`,
    [status, paymentId]
  );
  return result.rows[0];
}

/**
 * Get user's premium features
 */
export async function getUserPremiumFeatures(userId: number) {
  const result = await query(
    `SELECT id, user_id, feature_name, is_enabled, expires_at, created_at, updated_at
     FROM premium_features WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
}

/**
 * Enable a premium feature for a user
 */
export async function enablePremiumFeature(
  userId: number,
  featureName: string,
  expiresAt?: Date
) {
  const result = await query(
    `INSERT INTO premium_features (user_id, feature_name, is_enabled, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, feature_name, is_enabled, expires_at, created_at, updated_at`,
    [userId, featureName, true, expiresAt]
  );
  return result.rows[0];
}

/**
 * Record an analytics metric
 */
export async function recordAnalytic(
  userId: number,
  metricName: string,
  metricValue: number,
  recordedDate?: Date
) {
  const result = await query(
    `INSERT INTO analytics (user_id, metric_name, metric_value, recorded_date)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, metric_name, metric_value, recorded_date, created_at`,
    [userId, metricName, metricValue, recordedDate || new Date()]
  );
  return result.rows[0];
}

/**
 * Get user analytics by metric name
 */
export async function getUserAnalytics(userId: number, metricName: string) {
  const result = await query(
    `SELECT id, user_id, metric_name, metric_value, recorded_date, created_at
     FROM analytics WHERE user_id = $1 AND metric_name = $2
     ORDER BY recorded_date DESC`,
    [userId, metricName]
  );
  return result.rows;
}

/**
 * Send a notification
 */
export async function sendNotification(
  userId: number,
  notificationType: string,
  title: string,
  message: string
) {
  const result = await query(
    `INSERT INTO notifications (user_id, notification_type, title, message, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, notification_type, title, message, status, is_read, created_at, updated_at`,
    [userId, notificationType, title, message, 'sent']
  );
  return result.rows[0];
}

/**
 * Get user's notifications
 */
export async function getUserNotifications(userId: number) {
  const result = await query(
    `SELECT id, user_id, notification_type, title, message, status, is_read, created_at, updated_at
     FROM notifications WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: number) {
  const result = await query(
    `UPDATE notifications SET is_read = true, updated_at = NOW()
     WHERE id = $1
     RETURNING id, user_id, notification_type, title, message, status, is_read, created_at, updated_at`,
    [notificationId]
  );
  return result.rows[0];
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  action: string,
  userId?: number,
  resourceType?: string,
  resourceId?: number,
  details?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
) {
  const result = await query(
    `INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at`,
    [userId, action, resourceType, resourceId, JSON.stringify(details) || null, ipAddress, userAgent]
  );
  return result.rows[0];
}

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(userId: number, limit: number = 50) {
  const result = await query(
    `SELECT id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at
     FROM audit_logs WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

/**
 * Close database connections (should be called on app shutdown)
 */
export async function closePool() {
  await pool.end();
  console.log('Database pool closed');
}

export { Pool, PoolClient };
