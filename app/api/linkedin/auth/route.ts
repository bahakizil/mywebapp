import { NextRequest, NextResponse } from 'next/server';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/linkedin/callback`;

// Step 1: Redirect to LinkedIn authorization
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'login') {
    if (!LINKEDIN_CLIENT_ID) {
      return NextResponse.json({ error: 'LinkedIn client ID not configured' }, { status: 500 });
    }

    const scope = 'profile email w_member_social'; // Required scopes for profile and posting
    const state = Math.random().toString(36).substring(7); // CSRF protection
    
    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', LINKEDIN_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', scope);

    return NextResponse.redirect(authUrl.toString());
  }

  return NextResponse.json({ 
    message: 'LinkedIn OAuth endpoint',
    loginUrl: `/api/linkedin/auth?action=login`
  });
} 