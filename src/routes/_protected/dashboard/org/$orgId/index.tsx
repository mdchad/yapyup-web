import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { init } from '@paralleldrive/cuid2';
import { EditIcon } from "lucide-react";
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/lib/auth/use-auth-context';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils";
import { Skeleton } from '@/components/ui/skeleton';

const createId = init({
  random: Math.random,
  length: 12,
});

export const Route = createFileRoute('/_protected/dashboard/org/$orgId/')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = useParams({ from: '/_protected/dashboard/org/$orgId/' });
  const orgId = params.orgId;
  const { user } = useAuthContext();
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [members, setMembers] = useState<Array<any>>([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgAndMembers = async () => {
      setLoading(true);
      setMembersLoading(true);
      setError(null);
      setMembersError(null);
      try {
        // Fetch organisation
        const { data: orgData, error: orgError } = await supabase
          .from('organisations')
          .select('*')
          .eq('id', orgId)
          .single();
        if (orgError) throw orgError;
        setOrg(orgData);
        // Fetch members
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select(`id, email, user_id, name, organisation_id`)
          .eq('organisation_id', orgId);
        if (usersError) throw usersError;
        // Fetch roles from rbac schema
        const { data: rbacData, error: rbacError } = await supabase
          .schema('rbac')
          .from('user_role')
          .select(`user_id, role (id, name)`);
        if (rbacError) throw rbacError;
        const membersWithRoles = users.map((member: any) => {
          const role = rbacData.find((rbac: any) => rbac.user_id === member.user_id)?.role;
          return { ...member, role };
        });
        setMembers(membersWithRoles);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
        setMembersLoading(false);
      }
    };
    fetchOrgAndMembers();
  }, [orgId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrg({ ...org, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    // Update organisation in Supabase
    const { error: updateError } = await supabase
      .from('organisations')
      .update({
        name: org.name,
        slug: org.slug,
      })
      .eq('id', org.id);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
    }
    setSaving(false);
  };

  function generateSlug() {
    setOrg((prev: any) => ({ ...prev, slug: createId() }));
  }

  // if (loading) {
  //   return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  // }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!org) {
    return null;
  }

  return (
    <div className="flex">
      {/* Main content */}
      <main className="flex-1 flex flex-col py-12 px-48">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">General details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              {/* Logo preview */}
              {org.logo_url ? (
                <img src={org.logo_url} alt="Logo" className="w-16 h-16 rounded-full object-cover border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                  🏢
                </div>
              )}
              <div>
                <div className="font-semibold text-lg">{org.name}</div>
                <div className="text-gray-500 text-sm">Organization profile</div>
              </div>
              <Button type="submit" variant="outline" className="ml-auto" disabled={saving}>
                Edit profile
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={org.name || ''} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex gap-2">
                  <Input disabled id="slug" name="slug" value={org.slug || ''} onChange={handleChange} required />
                  <Button onClick={generateSlug} size="sm" type="button">Generate</Button>
                </div>
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">Saved!</div>}
            <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </form>
        </div>
        {/* Members table below the form */}
        <Card className="w-full max-w-2xl mt-12">
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div className="flex space-x-8" key={i}>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                ))}
              </div>
            ) : membersError ? (
              <div className="text-red-500">{membersError}</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td className="py-1">{member.name || '-'}</td>
                      <td className="py-1">{member.email}</td>
                      <td className="py-1">
                        {member.role ? member.role.name : '—'}
                      </td>
                      <td className="py-1">
                        <Link
                          to="/dashboard/org/$orgId/user/$userId"
                          params={{
                            orgId: member.organisation_id,
                            userId: member.id
                          }}
                        >
                          <Button size="icon" variant="ghost" className="cursor-pointer h-6 w-6">
                            <EditIcon className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 