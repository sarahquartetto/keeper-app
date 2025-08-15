-- Add images column to notes table
ALTER TABLE notes ADD COLUMN images TEXT[] DEFAULT '{}';

-- Update existing notes to have empty images array
UPDATE notes SET images = '{}' WHERE images IS NULL;


