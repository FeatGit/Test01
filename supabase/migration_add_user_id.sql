ALTER TABLE messages ADD COLUMN user_id uuid REFERENCES auth.users(id);
