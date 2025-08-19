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
export async function requireAdminServer(): Promise<
  | { ok: true }
  | { ok: false; status: number; error: string }
> {
  if (typeof window !== 'undefined') {
    throw new Error('This function should only be used in server components or API routes');
  }

  try {
    // Dynamic ESM import to avoid bundling server-only module on client
    const mod = await import('next/headers');
    type HeadersMinimal = { get(name: string): string | null };
    const h = (await Promise.resolve(mod.headers())) as unknown as HeadersMinimal;
    const cookieHeader: string = h.get('cookie') ?? '';
    const token = cookieHeader
      .split(';')
      .map((s: string) => s.trim())
      .find((p: string) => p.startsWith('admin_token='))
      ?.split('=')[1];
    const envToken = process.env.ADMIN_TOKEN || 'dev';

    if (!token || token !== envToken) {
      return { ok: false, status: 401, error: 'Unauthorized' } as const;
    }

    return { ok: true } as const;
  } catch (error) {
    console.error('Error in requireAdminServer:', error);
    return { ok: false, status: 500, error: 'Server error' } as const;
  }
}
