-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.car_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT car_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cars (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  price character varying NOT NULL,
  short_description text,
  main_image character varying,
  general_description text,
  is_contact boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT cars_pkey PRIMARY KEY (id),
  CONSTRAINT cars_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.car_categories(id)
);
CREATE TABLE public.car_colors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  car_id uuid,
  color_name character varying NOT NULL,
  hex_code character varying NOT NULL,
  image_url character varying NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT car_colors_pkey PRIMARY KEY (id),
  CONSTRAINT car_colors_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id)
);
CREATE TABLE public.car_detail_blocks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  car_id uuid,
  block_type character varying NOT NULL,
  content text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT car_detail_blocks_pkey PRIMARY KEY (id),
  CONSTRAINT car_detail_blocks_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id)
);
CREATE TABLE public.car_specifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  car_id uuid,
  image_url character varying NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT car_specifications_pkey PRIMARY KEY (id),
  CONSTRAINT car_specifications_car_id_fkey FOREIGN KEY (car_id) REFERENCES public.cars(id)
);
CREATE TABLE public.post_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT post_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category_id uuid,
  cover_image text,
  short_description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.post_categories(id)
);
CREATE TABLE public.post_blocks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  post_id uuid,
  block_type text NOT NULL,
  content text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT post_blocks_pkey PRIMARY KEY (id),
  CONSTRAINT post_blocks_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.lead_registrations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text,
  car_model text,
  type text NOT NULL,
  has_license text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'Mới'::text,
  CONSTRAINT lead_registrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.brochures (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  image_url text,
  file_url text NOT NULL,
  file_size text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT brochures_pkey PRIMARY KEY (id)
);
CREATE TABLE public.settings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  key text NOT NULL UNIQUE,
  value text,
  description text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_users_pkey PRIMARY KEY (id)
);