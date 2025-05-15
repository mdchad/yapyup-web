import { useEffect, useState } from 'react';
import { useAuthContext } from '@/lib/auth/use-auth-context';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {createFileRoute, Link} from "@tanstack/react-router";
import {cn} from "@/lib/utils";
import {init} from '@paralleldrive/cuid2';
import {EditIcon} from "lucide-react";

const createId = init({
  // A custom random function with the same API as Math.random.
  // You can use this to pass a cryptographically secure random function.
  random: Math.random,
  // the length of the id
  length: 12,
  // A custom fingerprint for the host environment. This is used to help
  // prevent collisions when generating ids in a distributed system.
});

export const Route = createFileRoute('/_protected/dashboard/org/$orgId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { data: orgData, error: orgError } = await supabase
      .from('organisations')
      .select('*')
      .eq('id', params.orgId)
      .single();

    if (orgError) {
      return orgError
    }

    const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          user_id,
          name,
          organisation_id
        `)
        .eq('organisation_id', orgData.id);

    if (usersError) {
      return usersError
    }

    const { data: rbacData, error: rbacError } = await supabase
    .schema('rbac')
    .from('user_role')
    .select(`
      user_id,
      role (
        id,
        name
      )
    `)

    if (rbacError) {
      return rbacError
    }

    const membersWithRoles = users.map((member) => {
      const role = rbacData.find((rbac) => rbac.user_id === member.user_id)?.role;
      return { ...member, role };
    });

    return {
      organisation: orgData,
      users: membersWithRoles
    }
  }
})

const SIDEBAR_ITEMS = [
  { key: 'general', label: 'General', icon: (
      <span className="mr-2">🏢</span>
    ) },
  { key: 'members', label: 'Members', icon: (
      <span className="mr-2">👥</span>
    ) },
];

function RouteComponent() {
  const { organisation, users } = Route.useLoaderData();
  const [org, setOrg] = useState<any>(organisation);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');

  // Members state
  const [members, setMembers] = useState<Array<any>>(users);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        email: org.email,
        phone: org.phone,
        website: org.website,
        logo_url: org.logo_url,
        description: org.description,
        address: org.address,
        city: org.city,
        state: org.state,
        postal_code: org.postal_code,
        country: org.country,
        tax_id: org.tax_id,
        status: org.status,
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
    console.log(createId())
  }

  // Fetch members and their roles when the tab is 'members'

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  if (!org) {
    return null;
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col py-8 px-6 min-h-screen">
        <div className="mb-8">
          <h2 className="text-lg font-semibold">Organization</h2>
          <p className="text-sm text-gray-500">Manage your organization.</p>
        </div>
        <nav className="flex flex-col gap-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.key}
              className={cn(
                'flex items-center px-3 py-2 rounded-md text-left transition-colors',
                activeTab === item.key ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100 text-gray-700'
              )}
              onClick={() => setActiveTab(item.key as 'general' | 'members')}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto text-xs text-gray-400 pt-8">Secured by <span className="font-semibold">yapyup</span></div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col py-12 px-6">
        {activeTab === 'general' && (
          <div className="flex flex-col gap-6 px-30">
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
                      <Input id="slug" name="slug" value={org.slug || ''} onChange={handleChange} required />
                      <Button onClick={generateSlug} size="sm">Generate</Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" value={org.email || ''} onChange={handleChange} type="email" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={org.phone || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" value={org.website || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input id="logo_url" name="logo_url" value={org.logo_url || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" value={org.description || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={org.address || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={org.city || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" value={org.state || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input id="postal_code" name="postal_code" value={org.postal_code || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={org.country || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tax_id">Tax ID</Label>
                    <Input id="tax_id" name="tax_id" value={org.tax_id || ''} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" name="status" value={org.status || ''} onChange={handleChange} />
                  </div>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">Saved!</div>}
                <Button type="submit" className="w-full" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              </form>
          </div>
        )}
        {activeTab === 'members' && (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              {membersLoading && <div>Loading members...</div>}
              {membersError && <div className="text-red-500">{membersError}</div>}
              {!membersLoading && !membersError && (
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
                          {member.role
                            ? member.role.name
                            : '—'}
                        </td>
                        <td className="py-1">
                          <Link
                            to="/dashboard/org/$orgId/user/$userId"
                            params={{
                              orgId: member.organisation_id,
                              userId: member.id
                            }}
                            state={{
                              member
                            }}
                          >
                            <Button size="icon" variant="ghost" className="cursor-pointer h-6 w-6">
                              <EditIcon className="w-4 h-4"/>
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
        )}
      </main>
    </div>
  );
} 