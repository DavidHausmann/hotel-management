DO $$
BEGIN
    -- Convert hotel_guest.name if it's bytea
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'hotel_guest'
          AND column_name = 'name'
          AND data_type = 'bytea'
    ) THEN
        ALTER TABLE hotel_guest
            ALTER COLUMN name
            TYPE text
            USING convert_from(name, 'UTF8');
    END IF;

    -- Convert hotel_guest.document if it's bytea
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'hotel_guest'
          AND column_name = 'document'
          AND data_type = 'bytea'
    ) THEN
        ALTER TABLE hotel_guest
            ALTER COLUMN document
            TYPE text
            USING convert_from(document, 'UTF8');
    END IF;

    -- Convert hotel_guest.phone if it's bytea
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'hotel_guest'
          AND column_name = 'phone'
          AND data_type = 'bytea'
    ) THEN
        ALTER TABLE hotel_guest
            ALTER COLUMN phone
            TYPE text
            USING convert_from(phone, 'UTF8');
    END IF;
END$$;
