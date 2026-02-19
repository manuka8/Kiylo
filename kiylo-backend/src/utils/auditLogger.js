import pool from '../config/database.js';

export const logAudit = async ({ userId, action, entityType, entityId, oldValue, newValue, ipAddress, userAgent }) => {
    const query = `
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

    try {
        await pool.execute(query, [
            userId || null,
            action,
            entityType || null,
            entityId || null,
            oldValue ? JSON.stringify(oldValue) : null,
            newValue ? JSON.stringify(newValue) : null,
            ipAddress || null,
            userAgent || null
        ]);
    } catch (err) {
        console.error('Audit Log Error:', err);
        // We don't throw here to avoid breaking the main request flow if logging fails
    }
};
