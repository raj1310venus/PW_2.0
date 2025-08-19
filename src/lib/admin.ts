// Client-side admin check
export function requireAdmin() {
  // This will be replaced by the actual token check in the browser
  if (typeof window === 'undefined') {
    // Server-side check will be handled by API routes
    return { ok: true as const };
  }
  
  // Client-side check
  const token = getCookie('admin_token');
  const envToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'dev';
  
  if (!token || token !== envToken) {
    return { ok: false as const, status: 401, error: 'Unauthorized' };
  }
  return { ok: true as const };
}

// Helper function to get cookies on the client side
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// Server-side admin check for API routes
export function requireAdminServer() {
  if (typeof window !== 'undefined') {
    throw new Error('This function should only be used in server components or API routes');
  }
  
  // This function should be called from server components or API routes
  // where cookies() from next/headers is available
  try {
    // @ts-ignore - This is a dynamic import that only works in server components
    const { cookies } = require('next/headers');
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;
    const envToken = process.env.ADMIN_TOKEN || 'dev';
    
    if (!token || token !== envToken) {
      return { ok: false as const, status: 401, error: 'Unauthorized' };
    }
    
    return { ok: true as const };
  } catch (error) {
    console.error('Error in requireAdminServer:', error);
    return { ok: false as const, status: 500, error: 'Server error' };
  }
}
