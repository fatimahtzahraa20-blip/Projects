-- Production schema and RLS for the StayPro hotel-owner workflow.
create type public.app_role as enum ('admin','owner','customer');
create type public.hotel_status as enum ('draft','pending','info_requested','rejected','approved','active','suspended');

create table public.profiles (id uuid primary key references auth.users on delete cascade, full_name text not null, role app_role not null default 'owner');
create table public.hotels (id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id), name text not null, business_name text not null, email text not null, phone text not null, address text not null, city text not null, country text not null, map_location text, description text, room_count int check(room_count>0), category text, status hotel_status not null default 'draft', rejection_reason text, verified boolean not null default false, logo_path text, cover_path text, created_at timestamptz not null default now(), submitted_at timestamptz);
create table public.hotel_documents (id uuid primary key default gen_random_uuid(), hotel_id uuid not null references public.hotels on delete cascade, kind text not null check(kind in('business_license','identity')), storage_path text not null, verified boolean not null default false);
create table public.hotel_gallery (id uuid primary key default gen_random_uuid(), hotel_id uuid not null references public.hotels on delete cascade, storage_path text not null, sort_order int not null default 0);
create table public.rooms (id uuid primary key default gen_random_uuid(), hotel_id uuid not null references public.hotels on delete cascade, name text not null, price numeric(12,2) not null check(price>=0), inventory int not null check(inventory>=0), available int not null check(available between 0 and inventory), guests int not null, size numeric, amenities text[] not null default '{}', active boolean not null default true);
create table public.room_photos (id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms on delete cascade, storage_path text not null);
create table public.room_availability (room_id uuid references public.rooms on delete cascade, date date, available int not null check(available>=0), price numeric(12,2) check(price>=0), primary key(room_id,date));
create table public.bookings (id uuid primary key default gen_random_uuid(), hotel_id uuid not null references public.hotels, customer_id uuid not null references public.profiles, room_id uuid references public.rooms, check_in date not null, check_out date not null, amount numeric(12,2) not null, status text not null check(status in('pending','confirmed','rejected','cancelled')));
create table public.reviews (id uuid primary key default gen_random_uuid(), hotel_id uuid not null references public.hotels, customer_id uuid not null references public.profiles, rating int not null check(rating between 1 and 5), body text not null, response text, created_at timestamptz not null default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles on delete cascade, body text not null, kind text, read boolean not null default false, created_at timestamptz not null default now());
create table public.cleaning_requests (id uuid primary key default gen_random_uuid(), hotel_id uuid not null references public.hotels, preferred_date date not null, notes text, status text not null default 'pending', team text, created_at timestamptz not null default now());

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;
create or replace function public.owns_hotel(h uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from hotels where id=h and owner_id=auth.uid()) $$;
create or replace function public.hotel_is_public(h uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from hotels where id=h and status in('approved','active')) $$;

alter table public.profiles enable row level security; alter table public.hotels enable row level security; alter table public.hotel_documents enable row level security; alter table public.hotel_gallery enable row level security; alter table public.rooms enable row level security; alter table public.room_photos enable row level security; alter table public.room_availability enable row level security; alter table public.bookings enable row level security; alter table public.reviews enable row level security; alter table public.notifications enable row level security; alter table public.cleaning_requests enable row level security;
create policy profiles_self_admin on public.profiles for select using(id=auth.uid() or public.is_admin());
create policy hotels_read on public.hotels for select using(owner_id=auth.uid() or public.is_admin() or status in('approved','active'));
create policy hotels_owner_insert on public.hotels for insert with check(owner_id=auth.uid() or public.is_admin());
create policy hotels_owner_update on public.hotels for update using(owner_id=auth.uid() or public.is_admin()) with check(owner_id=auth.uid() or public.is_admin());
create policy documents_owner_admin on public.hotel_documents for all using(public.owns_hotel(hotel_id) or public.is_admin()) with check(public.owns_hotel(hotel_id) or public.is_admin());
create policy gallery_read on public.hotel_gallery for select using(public.owns_hotel(hotel_id) or public.is_admin() or public.hotel_is_public(hotel_id));
create policy gallery_write on public.hotel_gallery for all using(public.owns_hotel(hotel_id) or public.is_admin()) with check(public.owns_hotel(hotel_id) or public.is_admin());
create policy rooms_read on public.rooms for select using(public.owns_hotel(hotel_id) or public.is_admin() or public.hotel_is_public(hotel_id));
create policy rooms_write on public.rooms for all using((public.owns_hotel(hotel_id) and public.hotel_is_public(hotel_id)) or public.is_admin()) with check((public.owns_hotel(hotel_id) and public.hotel_is_public(hotel_id)) or public.is_admin());
create policy room_photos_read on public.room_photos for select using(exists(select 1 from rooms r where r.id=room_id and (public.owns_hotel(r.hotel_id) or public.is_admin() or public.hotel_is_public(r.hotel_id))));
create policy availability_read on public.room_availability for select using(exists(select 1 from rooms r where r.id=room_id and (public.owns_hotel(r.hotel_id) or public.is_admin() or public.hotel_is_public(r.hotel_id))));
create policy bookings_access on public.bookings for select using(customer_id=auth.uid() or public.owns_hotel(hotel_id) or public.is_admin());
create policy reviews_read on public.reviews for select using(public.hotel_is_public(hotel_id) or public.owns_hotel(hotel_id) or public.is_admin());
create policy notifications_self on public.notifications for select using(user_id=auth.uid() or public.is_admin());
create policy cleaning_owner_admin on public.cleaning_requests for select using(public.owns_hotel(hotel_id) or public.is_admin());

-- Status changes and admin-only fields should be exposed through security-definer RPCs,
-- never through a broad client update grant. Storage buckets should mirror owns_hotel().

create policy room_photos_write on public.room_photos for all
using(exists(select 1 from rooms r where r.id=room_id and (public.owns_hotel(r.hotel_id) or public.is_admin())))
with check(exists(select 1 from rooms r where r.id=room_id and (public.owns_hotel(r.hotel_id) or public.is_admin())));
create policy availability_write on public.room_availability for all
using(exists(select 1 from rooms r where r.id=room_id and (public.owns_hotel(r.hotel_id) or public.is_admin())))
with check(exists(select 1 from rooms r where r.id=room_id and (public.owns_hotel(r.hotel_id) or public.is_admin())));
create policy bookings_customer_insert on public.bookings for insert with check(customer_id=auth.uid() and public.hotel_is_public(hotel_id));
create policy bookings_owner_update on public.bookings for update using(public.owns_hotel(hotel_id) or public.is_admin()) with check(public.owns_hotel(hotel_id) or public.is_admin());
create policy reviews_customer_insert on public.reviews for insert with check(customer_id=auth.uid() and public.hotel_is_public(hotel_id));
create policy reviews_owner_response on public.reviews for update using(public.owns_hotel(hotel_id) or public.is_admin()) with check(public.owns_hotel(hotel_id) or public.is_admin());
create policy notifications_self_update on public.notifications for update using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy cleaning_owner_insert on public.cleaning_requests for insert with check(public.owns_hotel(hotel_id) and public.hotel_is_public(hotel_id));
create policy cleaning_admin_update on public.cleaning_requests for update using(public.is_admin()) with check(public.is_admin());

create or replace function public.set_hotel_status(target uuid, next_status hotel_status, admin_reason text default null)
returns public.hotels language plpgsql security definer set search_path=public as $$
declare result public.hotels;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if next_status not in ('pending','info_requested','rejected','approved','active','suspended') then raise exception 'Invalid status'; end if;
  update hotels set status=next_status,rejection_reason=admin_reason where id=target returning * into result;
  insert into notifications(user_id,body,kind) values(result.owner_id,result.name||' status changed to '||replace(next_status::text,'_',' '),'status');
  return result;
end $$;

insert into storage.buckets(id,name,public) values('hotel-public','hotel-public',true),('hotel-private','hotel-private',false) on conflict(id) do nothing;
create policy hotel_public_read on storage.objects for select using(bucket_id='hotel-public');
create policy hotel_public_owner_upload on storage.objects for insert to authenticated
with check(bucket_id='hotel-public' and (storage.foldername(name))[1]=auth.uid()::text);
create policy hotel_public_owner_manage on storage.objects for update to authenticated
using(bucket_id='hotel-public' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));
create policy hotel_public_owner_delete on storage.objects for delete to authenticated
using(bucket_id='hotel-public' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));
create policy hotel_private_owner_admin on storage.objects for all to authenticated
using(bucket_id='hotel-private' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()))
with check(bucket_id='hotel-private' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));
