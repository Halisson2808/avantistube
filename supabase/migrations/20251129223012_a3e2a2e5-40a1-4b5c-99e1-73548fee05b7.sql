-- Remover trigger antigo que usa updated_at em monitored_channels
DROP TRIGGER IF EXISTS set_updated_at_monitored_channels ON monitored_channels;