-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS update_monitored_channels_updated_at ON monitored_channels;

-- Criar função para atualizar last_updated
CREATE OR REPLACE FUNCTION update_monitored_channels_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar last_updated automaticamente
CREATE TRIGGER update_monitored_channels_last_updated
  BEFORE UPDATE ON monitored_channels
  FOR EACH ROW
  EXECUTE FUNCTION update_monitored_channels_last_updated();