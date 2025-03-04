-- Combine all migrations into a single script

-- Migration 0001: Create Checklist Tables
CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  observations text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  inspection_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS meter_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current numeric NOT NULL,
  previous numeric NOT NULL,
  date timestamptz NOT NULL,
  consumption numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  inspection_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS for Migration 0001
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meter_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for checklist_items
CREATE POLICY "Users can view their own checklist items"
  ON checklist_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklist items"
  ON checklist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist items"
  ON checklist_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for meter_readings
CREATE POLICY "Users can view their own meter readings"
  ON meter_readings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meter readings"
  ON meter_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meter readings"
  ON meter_readings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Migration 0002: Technical Inspections Schema
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  property_data JSONB NOT NULL,
  structural_conditions JSONB NOT NULL,
  installations JSONB NOT NULL,
  inspector_data JSONB NOT NULL,
  template_id UUID,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS inspection_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  category TEXT,
  item_id UUID
);

-- Enable RLS for Migration 0002
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for inspections
CREATE POLICY "Users can view their own inspections"
  ON inspections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inspections"
  ON inspections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inspections"
  ON inspections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inspections"
  ON inspections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for inspection_photos
CREATE POLICY "Users can view photos from their inspections"
  ON inspection_photos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = inspection_photos.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert photos to their inspections"
  ON inspection_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = inspection_photos.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update photos from their inspections"
  ON inspection_photos
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = inspection_photos.inspection_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = inspection_photos.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete photos from their inspections"
  ON inspection_photos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = inspection_photos.inspection_id
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS inspections_user_id_idx ON inspections(user_id);
CREATE INDEX IF NOT EXISTS inspection_photos_inspection_id_idx ON inspection_photos(inspection_id);

-- Migration 0003: Inspection Templates
CREATE TABLE IF NOT EXISTS inspection_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sections JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS for inspection_templates
ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;

-- Policies for inspection_templates
CREATE POLICY "Users can view their own templates"
  ON inspection_templates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates"
  ON inspection_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON inspection_templates
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON inspection_templates
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Migration 0004: Rooms, External Areas, and Keys/Meters
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  condition TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  photos JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS external_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  condition TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  photos JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS keys_and_meters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  key_type TEXT,
  key_quantity INTEGER,
  key_notes TEXT,
  electricity_meter_number TEXT,
  electricity_reading NUMERIC,
  gas_meter_number TEXT,
  gas_reading NUMERIC,
  water_meter_number TEXT,
  water_reading NUMERIC,
  photos JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Migration 0004
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE keys_and_meters ENABLE ROW LEVEL SECURITY;

-- Policies for rooms
CREATE POLICY "Users can view rooms from their inspections"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = rooms.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rooms for their inspections"
  ON rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = rooms.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update rooms from their inspections"
  ON rooms
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = rooms.inspection_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = rooms.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete rooms from their inspections"
  ON rooms
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = rooms.inspection_id
      AND user_id = auth.uid()
    )
  );

-- Policies for external_areas
CREATE POLICY "Users can view external areas from their inspections"
  ON external_areas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = external_areas.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create external areas for their inspections"
  ON external_areas
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = external_areas.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update external areas from their inspections"
  ON external_areas
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = external_areas.inspection_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = external_areas.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete external areas from their inspections"
  ON external_areas
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = external_areas.inspection_id
      AND user_id = auth.uid()
    )
  );

-- Policies for keys_and_meters
CREATE POLICY "Users can view keys and meters from their inspections"
  ON keys_and_meters
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = keys_and_meters.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create keys and meters for their inspections"
  ON keys_and_meters
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = keys_and_meters.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update keys and meters from their inspections"
  ON keys_and_meters
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = keys_and_meters.inspection_id
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = keys_and_meters.inspection_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete keys and meters from their inspections"
  ON keys_and_meters
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inspections
      WHERE id = keys_and_meters.inspection_id
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS rooms_inspection_id_idx ON rooms(inspection_id);
CREATE INDEX IF NOT EXISTS external_areas_inspection_id_idx ON external_areas(inspection_id);
CREATE INDEX IF NOT EXISTS keys_and_meters_inspection_id_idx ON keys_and_meters(inspection_id);
