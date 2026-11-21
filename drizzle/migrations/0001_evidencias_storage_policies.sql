CREATE POLICY "Evidence files readable" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'evidencias');
CREATE POLICY "Evidence files uploadable" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'evidencias');
CREATE POLICY "Evidence files removable" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'evidencias');