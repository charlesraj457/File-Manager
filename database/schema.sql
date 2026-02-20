-- Database Schema for CloudVault
-- Table: users

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar_url VARCHAR(255),
    storage_used BIGINT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL
);

-- Common Database Queries for CloudVault Users

-- 1. Create a new user (Signup)
-- INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?);

-- 2. Get user by email (Login)
-- SELECT * FROM users WHERE email = ? AND status = 'active';

-- 3. Update last login time
-- UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?;

-- 4. Update storage usage (e.g., after file upload)
-- UPDATE users SET storage_used = storage_used + ? WHERE id = ?;

-- 5. Change user role (Admin only)
-- UPDATE users SET role = ? WHERE id = ?;

-- 6. Deactivate account
-- UPDATE users SET status = 'inactive' WHERE id = ?;

-- 7. Get all admin users
SELECT * FROM users WHERE role = 'admin';

-- 8. Search users by name or email
SELECT id, full_name, email, role, status FROM users 
WHERE full_name LIKE '%searchTerm%' OR email LIKE '%searchTerm%';

-- 9. Get top storage consumers (Admin view)
SELECT id, full_name, storage_used FROM users 
ORDER BY storage_used DESC LIMIT 10;

-- 10. Update user profile (Avatar URL and Full Name)
UPDATE users SET full_name = ?, avatar_url = ? WHERE id = ?;

-- 11. Count active vs inactive users
SELECT status, COUNT(*) as count FROM users GROUP BY status;

-- 12. List users who haven't logged in for 30 days
SELECT id, full_name, email, last_login_at FROM users 
WHERE last_login_at < DATE_SUB(NOW(), INTERVAL 30 DAY) OR last_login_at IS NULL;

-- 13. Reset password (update hash)
UPDATE users SET password_hash = ? WHERE id = ?;

-- 14. Get users with paging (for admin table)
SELECT id, full_name, email, role, status, last_login_at 
FROM users 
ORDER BY created_at DESC 
LIMIT ? OFFSET ?;

-- 15. Count total users for pagination
SELECT COUNT(*) as total FROM users;

-- 16. Toggle user status (Enable/Disable)
UPDATE users SET status = IF(status = 'active', 'inactive', 'active') WHERE id = ?;

-- 17. Change user role
UPDATE users SET role = ? WHERE id = ?;

-- 18. Get aggregate storage metrics
SELECT 
    SUM(storage_used) as total_used,
    AVG(storage_used) as average_per_user,
    MAX(storage_used) as max_usage
FROM users;

-- 19. Get storage usage by role
SELECT role, SUM(storage_used) as total_storage 
FROM users 
GROUP BY role;

-- 20. Delete user (Hard delete - use with caution)
-- DELETE FROM users WHERE id = ?;

-- Table: folders
CREATE TABLE IF NOT EXISTS folders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    parent_id INT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE SET NULL
);

-- Folder Queries

-- 1. Create a new folder
-- INSERT INTO folders (user_id, parent_id, name) VALUES (?, ?, ?);

-- 2. List folders in a specific directory (parent_id)
-- SELECT * FROM folders WHERE user_id = ? AND parent_id = ? AND is_deleted = FALSE;

-- 3. Soft delete a folder (Move to Trash)
-- UPDATE folders SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ?;

-- 4. Restore a folder from trash
-- UPDATE folders SET is_deleted = FALSE, deleted_at = NULL WHERE id = ?;

-- 5. Rename folder
-- UPDATE folders SET name = ? WHERE id = ?;

-- Table: files
CREATE TABLE IF NOT EXISTS files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    folder_id INT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    is_starred BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL
);

-- File Queries

-- 1. Create a new file record
-- INSERT INTO files (user_id, folder_id, name, original_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?);

-- 2. List files in a folder
-- SELECT * FROM files WHERE user_id = ? AND folder_id = ? AND is_deleted = FALSE;

-- 3. Get all starred files
-- SELECT * FROM files WHERE user_id = ? AND is_starred = TRUE AND is_deleted = FALSE;

-- 4. Move file to trash
-- UPDATE files SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ?;

-- 5. Toggle star status
-- UPDATE files SET is_starred = NOT is_starred WHERE id = ?;

-- 6. Update file name (Rename)
-- UPDATE files SET name = ? WHERE id = ?;

-- 7. Get storage used by user (Sum of all files)
-- SELECT SUM(file_size) FROM files WHERE user_id = ? AND is_deleted = FALSE;

-- Table: shared_items
CREATE TABLE IF NOT EXISTS shared_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_type ENUM('file', 'folder') NOT NULL,
    item_id INT NOT NULL,
    owner_id INT NOT NULL,
    shared_with_id INT NOT NULL,
    permission ENUM('view', 'edit') DEFAULT 'view',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sharing Queries

-- 1. Share an item
-- INSERT INTO shared_items (item_type, item_id, owner_id, shared_with_id, permission) VALUES (?, ?, ?, ?, ?);

-- 2. List items shared WITH me
-- SELECT s.*, f.name as file_name, fo.name as folder_name 
-- FROM shared_items s
-- LEFT JOIN files f ON s.item_id = f.id AND s.item_type = 'file'
-- LEFT JOIN folders fo ON s.item_id = fo.id AND s.item_type = 'folder'
-- WHERE s.shared_with_id = ?;

-- 3. List items I have shared with OTHERS
-- SELECT * FROM shared_items WHERE owner_id = ?;

-- 4. Check if a user has access to an item
-- SELECT permission FROM shared_items WHERE shared_with_id = ? AND item_id = ? AND item_type = ?;

-- 5. Revoke sharing access
-- DELETE FROM shared_items WHERE id = ?;

-- 6. Update sharing permission
-- UPDATE shared_items SET permission = ? WHERE id = ?;

-- Table: activity_logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity Log Queries

-- 1. Create a log entry
-- INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?);

-- 2. List recent activities for Admin Dashboard
-- SELECT a.*, u.full_name 
-- FROM activity_logs a
-- JOIN users u ON a.user_id = u.id
-- ORDER BY a.created_at DESC 
-- LIMIT 50;

-- 3. Filter logs by user
-- SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC;

-- 4. Filter logs by action type
-- SELECT * FROM activity_logs WHERE action = 'UPLOAD' ORDER BY created_at DESC;

-- 5. Count actions by type (for Analytics)
-- SELECT action, COUNT(*) as count FROM activity_logs GROUP BY action;

-- Table: devices
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    last_synced_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: settings
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Device & Setting Queries

-- 1. Register a new device
-- INSERT INTO devices (user_id, device_name, device_type) VALUES (?, ?, ?);

-- 2. List user devices
-- SELECT * FROM devices WHERE user_id = ? AND is_active = TRUE;

-- 3. Update sync time
-- UPDATE devices SET last_synced_at = CURRENT_TIMESTAMP WHERE id = ?;

-- 4. Get application setting
-- SELECT setting_value FROM settings WHERE setting_key = ?;

-- 5. Update application setting
-- INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = CURRENT_TIMESTAMP;
