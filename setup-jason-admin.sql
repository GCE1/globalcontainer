-- Create Admin User Account for Jason Stachow
-- This script sets up a super admin account with full permissions

-- First, let's create the admin roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_roles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR REFERENCES users(id) NOT NULL,
    role VARCHAR NOT NULL DEFAULT 'admin',
    permissions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert the admin user (you'll need to provide email and password)
INSERT INTO users (
    id,
    email,
    first_name,
    last_name,
    role,
    subscription_tier,
    subscription_status,
    two_factor_enabled,
    last_login,
    created_at,
    updated_at
) VALUES (
    'admin-jason-' || EXTRACT(EPOCH FROM NOW())::text,
    'jason@example.com', -- Replace with your actual email
    'Jason',
    'Stachow',
    'admin',
    'expert',
    'active',
    false,
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Get the user ID for the admin role assignment
DO $$
DECLARE
    user_uuid VARCHAR;
BEGIN
    SELECT id INTO user_uuid FROM users WHERE email = 'jason@example.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Insert admin role
        INSERT INTO admin_roles (
            user_id,
            role,
            permissions,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            user_uuid,
            'super_admin',
            '{"users": ["create", "read", "update", "delete"], "orders": ["create", "read", "update", "delete"], "containers": ["create", "read", "update", "delete"], "analytics": ["read"], "settings": ["create", "read", "update", "delete"], "security": ["create", "read", "update", "delete"], "billing": ["read", "update"], "system": ["read", "update"]}'::jsonb,
            true,
            NOW(),
            NOW()
        ) ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Verify the admin user was created
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.subscription_tier,
    ar.role as admin_role,
    ar.permissions
FROM users u
LEFT JOIN admin_roles ar ON u.id = ar.user_id
WHERE u.email = 'jason@example.com';