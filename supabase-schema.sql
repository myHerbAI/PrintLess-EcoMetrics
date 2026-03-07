-- Create tips table
CREATE TABLE IF NOT EXISTS tips (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL,
  impact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_tips table to store pinned tips
CREATE TABLE IF NOT EXISTS user_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tip_id TEXT NOT NULL REFERENCES tips(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, tip_id)
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_challenges table to store user participation in challenges
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, challenge_id)
);

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample tips data
INSERT INTO tips (id, title, description, category, impact) VALUES
('reduce-standby-power', 'Reduce Standby Power', 'Unplug electronics when not in use to save energy and reduce your carbon footprint.', 'Energy', 'Medium'),
('reusable-bags', 'Use Reusable Bags', 'Bring your own bags when shopping to reduce plastic waste.', 'Waste', 'High'),
('shorter-showers', 'Shorter Showers', 'Cut your shower time by 2 minutes to save up to 10 gallons of water.', 'Water', 'Medium'),
('led-bulbs', 'LED Light Bulbs', 'Replace incandescent bulbs with LED bulbs to use 75% less energy.', 'Energy', 'High'),
('compost-food-scraps', 'Compost Food Scraps', 'Compost food waste to reduce methane emissions from landfills.', 'Waste', 'Medium'),
('fix-leaky-faucets', 'Fix Leaky Faucets', 'A dripping faucet can waste up to 3,000 gallons of water per year.', 'Water', 'Medium'),
('cold-water-laundry', 'Wash Clothes in Cold Water', 'Using cold water for laundry saves energy and keeps clothes looking new longer.', 'Energy', 'Medium'),
('avoid-single-use-plastics', 'Avoid Single-Use Plastics', 'Choose reusable alternatives to single-use plastic items like straws and utensils.', 'Waste', 'High'),
('collect-rainwater', 'Collect Rainwater', 'Use a rain barrel to collect water for your garden and plants.', 'Water', 'Medium')
ON CONFLICT (id) DO NOTHING;

-- Insert sample challenges data
INSERT INTO challenges (id, title, description, start_date, end_date, difficulty, category) VALUES
('meatless-monday', 'Meatless Monday', 'Skip meat for a day and reduce your carbon footprint.', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE + INTERVAL '21 days', 'Easy', 'Food'),
('zero-waste-week', 'Zero Waste Week', 'Minimize your waste production for an entire week.', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '25 days', 'Medium', 'Waste'),
('bike-to-work', 'Bike to Work', 'Leave your car at home and cycle to work for a week.', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '23 days', 'Medium', 'Transportation'),
('energy-saver', 'Energy Saver', 'Reduce your home energy consumption by 20% this month.', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 'Medium', 'Energy'),
('plastic-free-shopping', 'Plastic-Free Shopping', 'Avoid all single-use plastic when shopping for groceries.', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '26 days', 'Hard', 'Waste'),
('local-food-challenge', 'Local Food Challenge', 'Only eat food produced within 100 miles of your home.', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '27 days', 'Hard', 'Food')
ON CONFLICT (id) DO NOTHING;
