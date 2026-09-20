-- Migration 007: Permanently purge the legacy manufacturing seed jobs
-- These rows were inserted by full_schema_setup.sql with source='career_page'
-- and are India-manufacturing-specific placeholders, not real live scrapes.
-- The app now uses a global, multi-domain job feed so these seeds are stale/misleading.

delete from public.jobs
where company in (
  'Tata Steel',
  'JSW Steel',
  'Vedanta',
  'Bosch',
  'Hindalco',
  'Siemens'
)
  and source = 'career_page'
  and source_kind = 'career_page';
