create table entries ( 
  id bigint generated always as identity primary key,
  date date not null default current_date,
  task text not null,
  hours numeric(4, 2) not null,
  created_at timestamptz not null default now(),
  notes text
);
--temporary: no users yet.
alter table entries disable row level security;

