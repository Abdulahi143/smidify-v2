-- Alt text is required whenever an image is uploaded from the admin editors.
alter table projects add column cover_alt text, add column gallery_alts text[] not null default '{}';
alter table posts add column cover_alt text;
