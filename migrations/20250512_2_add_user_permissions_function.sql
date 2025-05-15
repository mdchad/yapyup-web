create or replace function public.get_user_permissions(p_user_id uuid)
returns table (
  user_id uuid,
  role character varying,
  permission character varying
) language sql security definer as $$
  select
    ur.user_id as user_id,
    r.name as role,
    p.name as permission
  from
    rbac.permission p
    join rbac.role_permission rp on rp.permission_id = p.id
    join rbac.role r on r.id = rp.role_id
    join rbac.user_role ur on ur.role_id = r.id
  where
    ur.user_id = p_user_id;
$$;