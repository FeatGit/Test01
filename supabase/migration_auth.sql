-- 1. Tabella profili utente
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 2. Trigger: crea profilo automatico alla registrazione
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8))
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW; -- non bloccare mai la creazione utente
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. Aggiorna messages: rimuovi author, cambia FK a profiles
TRUNCATE messages;
ALTER TABLE messages DROP COLUMN author;
ALTER TABLE messages DROP CONSTRAINT messages_user_id_fkey;
ALTER TABLE messages ADD CONSTRAINT messages_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id);
ALTER TABLE messages ALTER COLUMN user_id SET NOT NULL;

-- 4. Abilita Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
