import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { dbRepo } from '@/lib/db';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { User, Organization } from './types';

export interface AuthContext {
  user: {
    id: string;
    email: string;
    name: string;
    is_platform_admin: boolean;
  };
  org: Organization;
  role: 'owner' | 'admin' | 'member';
}

/**
 * Get currently authenticated user from Supabase session
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const dbUser = await dbRepo.getUserById(user.id);
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim().toLowerCase());
    const isPlatformAdmin = Boolean(dbUser?.is_platform_admin || (user.email && adminEmails.includes(user.email.toLowerCase())));

    return {
      id: user.id,
      email: user.email || '',
      name: dbUser?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      is_platform_admin: isPlatformAdmin,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Require an authenticated user, or redirect to /login
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

/**
 * Resolves user's active organization and checks membership authorization
 */
export async function requireOrgMembership(requestedOrgId?: string): Promise<AuthContext> {
  const user = await requireUser();
  const orgs = await dbRepo.getUserOrganizations(user.id);

  if (!orgs || orgs.length === 0) {
    // If no org exists, ensure initial org creation
    const newOrg = await dbRepo.createOrganization(`${user.name}'s Venue`, user.id);
    return {
      user,
      org: newOrg,
      role: 'owner',
    };
  }

  let selectedOrg = orgs[0].organization;
  let memberRole = orgs[0].role;

  if (requestedOrgId) {
    const matched = orgs.find((o) => o.organization.id === requestedOrgId);
    if (matched) {
      selectedOrg = matched.organization;
      memberRole = matched.role;
    } else if (user.is_platform_admin) {
      // Platform admin override
      const adminOrg = await dbRepo.getOrganization(requestedOrgId);
      if (adminOrg) {
        selectedOrg = adminOrg;
        memberRole = 'owner';
      }
    } else {
      throw new Error('Unauthorized: You are not a member of this organization');
    }
  }

  return {
    user,
    org: selectedOrg,
    role: memberRole,
  };
}

/**
 * Enforce platform operator admin access separately from merchant permissions
 */
export async function requirePlatformAdmin() {
  const user = await requireUser();
  if (!user.is_platform_admin) {
    redirect('/my?error=unauthorized_admin_access');
  }
  return user;
}

/**
 * API Route Helper for Platform Admin
 */
export async function checkAdminApiAccess(req?: Request): Promise<{ authorized: boolean; user?: any; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { authorized: false, error: 'Unauthorized: Authentication required' };
  }
  if (!user.is_platform_admin) {
    return { authorized: false, error: 'Forbidden: Platform operator privileges required' };
  }
  return { authorized: true, user };
}

/**
 * API Route Helper for Merchant Org Access
 */
export async function checkOrgApiAccess(requestedOrgId?: string): Promise<{ authorized: boolean; context?: AuthContext; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { authorized: false, error: 'Unauthorized: Authentication required' };
    }
    const context = await requireOrgMembership(requestedOrgId);
    return { authorized: true, context };
  } catch (err: any) {
    return { authorized: false, error: err.message || 'Forbidden' };
  }
}
