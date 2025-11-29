-- Recriar função com search_path definido para segurança
CREATE OR REPLACE FUNCTION update_monitored_channels_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;