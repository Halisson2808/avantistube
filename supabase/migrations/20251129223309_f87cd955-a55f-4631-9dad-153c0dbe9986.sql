-- Criar tipo enum para content_type se não existir
DO $$ BEGIN
  CREATE TYPE content_type_enum AS ENUM ('longform', 'shorts');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Criar uma nova coluna temporária com o tipo enum
ALTER TABLE monitored_channels ADD COLUMN content_type_new content_type_enum;

-- Copiar os dados da coluna antiga para a nova
UPDATE monitored_channels 
SET content_type_new = content_type::content_type_enum;

-- Remover a coluna antiga
ALTER TABLE monitored_channels DROP COLUMN content_type;

-- Renomear a nova coluna
ALTER TABLE monitored_channels RENAME COLUMN content_type_new TO content_type;

-- Definir valor padrão
ALTER TABLE monitored_channels ALTER COLUMN content_type SET DEFAULT 'longform'::content_type_enum;