-- Create a storage bucket for audio files
insert into storage.buckets (id, name, public)
values ('audio', 'audio', true);

-- Allow public access to the audio bucket
create policy "Allow public read access"
  on storage.objects for select
  using ( bucket_id = 'audio' );

create policy "Allow public upload access"
  on storage.objects for insert
  with check ( bucket_id = 'audio' );