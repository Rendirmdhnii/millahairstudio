-- Milla Hair Studio - Enterprise Database Schema
-- Compatible with PostgreSQL and Supabase

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES
CREATE TYPE user_role AS ENUM (
  'customer', 
  'receptionist', 
  'cashier', 
  'stylist', 
  'manager', 
  'admin', 
  'super_admin', 
  'owner'
);

-- 2. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  encrypted_password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url VARCHAR(500),
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 3. BRANCHES
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50),
  rating DECIMAL(3,2) DEFAULT 5.00,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. STYLISTS
CREATE TABLE stylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  specialty TEXT[] NOT NULL,
  rating DECIMAL(3,2) DEFAULT 5.00,
  experience_years INT DEFAULT 0,
  bio TEXT,
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, leave, vacation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SERVICE CATEGORIES
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  description TEXT
);

-- 6. SERVICES
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  duration_mins INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  image_url VARCHAR(500),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MEMBERSHIPS
CREATE TYPE membership_tier AS ENUM ('silver', 'gold', 'platinum');

CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name membership_tier UNIQUE NOT NULL,
  discount_percent DECIMAL(5,2) DEFAULT 0.00,
  point_multiplier DECIMAL(3,2) DEFAULT 1.00,
  min_spend_annual DECIMAL(12,2) DEFAULT 0.00
);

-- 8. CUSTOMERS
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  loyalty_points_balance INT DEFAULT 0,
  membership_tier membership_tier DEFAULT 'silver',
  allergies TEXT[],
  preferences TEXT,
  birth_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_user ON customers(user_id);

-- 9. APPOINTMENTS
CREATE TYPE appointment_status AS ENUM (
  'pending', 
  'approved', 
  'completed', 
  'cancelled'
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  time_slot VARCHAR(10) NOT NULL, -- e.g., "10:00"
  status appointment_status DEFAULT 'pending',
  notes TEXT,
  total_price DECIMAL(12,2) NOT NULL,
  deposit_paid DECIMAL(12,2) DEFAULT 0.00,
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, partial, paid, refunded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);

-- 10. APPOINTMENT SERVICES
CREATE TABLE appointment_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
  actual_price DECIMAL(12,2) NOT NULL
);

-- 11. PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_type VARCHAR(50) NOT NULL, -- 'appointment' or 'order'
  reference_id UUID NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- qris, bank_transfer, ewallet, cash, points, voucher
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, expired
  payment_gateway_transaction_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. MEMBERSHIP TRANSACTIONS
CREATE TABLE membership_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  tier membership_tier NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- upgrade, renewal, downgrade
  amount DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. LOYALTY POINTS
CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  points_changed INT NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL, -- earn, redeem, adjust
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. VOUCHERS
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_amount DECIMAL(12,2) NOT NULL,
  is_percentage BOOLEAN DEFAULT FALSE,
  min_purchase DECIMAL(12,2) DEFAULT 0.00,
  expiry_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  limit_count INT DEFAULT -1, -- -1 for unlimited
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. GIFT CARDS
CREATE TABLE gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  initial_balance DECIMAL(12,2) NOT NULL,
  current_balance DECIMAL(12,2) NOT NULL,
  expiry_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. PRODUCT CATEGORIES
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL
);

-- 17. PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100) UNIQUE,
  image_url VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 5.00,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  discount DECIMAL(12,2) DEFAULT 0.00,
  total DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, cancelled
  shipping_address TEXT,
  tracking_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'processing', -- processing, shipped, delivered, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL
);

-- 20. SUPPLIERS
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. INVENTORY
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  stock_count INT NOT NULL DEFAULT 0,
  min_stock_alert INT NOT NULL DEFAULT 5,
  last_restocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, branch_id)
);

-- 22. INVENTORY LOGS
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  quantity_changed INT NOT NULL,
  log_type VARCHAR(50) NOT NULL, -- stock_in, stock_out, transfer_in, transfer_out
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. PURCHASE ORDERS
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  order_date DATE NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, ordered, received, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 24. REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  before_image_url VARCHAR(500),
  after_image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 25. BLOGS
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) UNIQUE NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE
);

-- 26. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  type VARCHAR(50), -- info, appointment, order, marketing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 27. MARKETING CAMPAIGNS
CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  channel VARCHAR(20) NOT NULL, -- whatsapp, email, push
  trigger_type VARCHAR(50) NOT NULL, -- manual, birthday, rebooking_reminder, win_back
  message_template TEXT NOT NULL,
  stats_sent INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 28. AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================
-- DATABASE TRIGGERS
-- ==============================================================

-- Trigger to update inventory count on inventory logs entry
CREATE OR REPLACE FUNCTION process_inventory_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO inventory (product_id, branch_id, stock_count)
  VALUES (NEW.product_id, NEW.branch_id, NEW.quantity_changed)
  ON CONFLICT (product_id, branch_id) DO UPDATE
  SET stock_count = inventory.stock_count + NEW.quantity_changed,
      updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_process_inventory_log
AFTER INSERT ON inventory_logs
FOR EACH ROW
EXECUTE FUNCTION process_inventory_log();

-- Trigger to earn loyalty points when appointment status becomes 'completed'
CREATE OR REPLACE FUNCTION process_loyalty_earn()
RETURNS TRIGGER AS $$
DECLARE
  points_earned INT;
  cust_id UUID;
  multiplier DECIMAL(3,2);
  tier_var membership_tier;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Get customer tier and point multiplier
    SELECT membership_tier, id INTO tier_var, cust_id FROM customers WHERE id = NEW.customer_id;
    SELECT point_multiplier INTO multiplier FROM memberships WHERE tier_name = tier_var;
    
    -- Calculation: 1 point per Rp 10.000 spent, multiplied by membership tier factor
    points_earned := FLOOR((NEW.total_price / 10000) * COALESCE(multiplier, 1.00));
    
    IF points_earned > 0 THEN
      -- Record points transaction
      INSERT INTO loyalty_points (customer_id, points_changed, description, type)
      VALUES (cust_id, points_earned, 'Earned from appointment ' || NEW.id, 'earn');
      
      -- Update customer points balance
      UPDATE customers 
      SET loyalty_points_balance = loyalty_points_balance + points_earned
      WHERE id = cust_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_process_loyalty_earn
AFTER UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION process_loyalty_earn();

-- ==============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY user_read_own ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY user_update_own ON users 
  FOR UPDATE USING (auth.uid() = id);

-- Admin and Owner can read all users
CREATE POLICY staff_read_all ON users 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('owner', 'super_admin', 'admin', 'manager')
    )
  );

-- Customers policies
CREATE POLICY customer_read_own ON customers 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY customer_update_own ON customers 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY staff_manage_customers ON customers 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('owner', 'super_admin', 'admin', 'manager', 'receptionist', 'cashier')
    )
  );
