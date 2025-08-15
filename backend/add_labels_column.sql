-- Add labels column to notes table
ALTER TABLE notes ADD COLUMN labels TEXT[] DEFAULT '{}';

-- Update existing notes to have empty labels array
UPDATE notes SET labels = '{}' WHERE labels IS NULL;

