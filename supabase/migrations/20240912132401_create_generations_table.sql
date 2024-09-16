create table
  public.categories (
    id uuid not null default gen_random_uuid (),
    title text not null,
    items integer not null default 1,
    created_at timestamp with time zone not null default now(),
    constraint categories_pkey primary key (id)
  ) tablespace pg_default;

create table
  public.generations (
    id uuid not null default gen_random_uuid (),
    promt text not null,
    status text not null default 'PROCESSING'::text,
    created_at timestamp with time zone not null default now(),
    category uuid null,
    constraint generations_pkey primary key (id),
    constraint generations_category_fkey foreign key (category) references categories (id) on delete set null
  ) tablespace pg_default;

  create table
  public.images (
    id uuid not null default gen_random_uuid (),
    generation uuid not null,
    url text not null,
    created_at timestamp with time zone not null default now(),
    constraint images_pkey primary key (id),
    constraint images_generation_fkey foreign key (generation) references generations (id) on delete set null
  ) tablespace pg_default;