import { NextRequest, NextResponse } from 'next/server';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/linkedin/callback`;

// Step 2: Handle LinkedIn OAuth callback and exchange code for access token
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ 
      error: 'LinkedIn authorization failed', 
      details: error 
    }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ 
      error: 'No authorization code received' 
    }, { status: 400 });
  }

  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
    return NextResponse.json({ 
      error: 'LinkedIn credentials not configured' 
    }, { status: 500 });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${tokenResponse.status} ${errorData}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    // Get user profile to verify the token works
    const profileResponse = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!profileResponse.ok) {
      throw new Error(`Profile fetch failed: ${profileResponse.status}`);
    }

    const profile = await profileResponse.json();

    // In a real application, you would store this token securely
    // For now, we'll return it in the response for manual setup
    return NextResponse.json({
      success: true,
      message: 'LinkedIn authentication successful!',
      accessToken: accessToken,
      expiresIn: tokenData.expires_in,
      profile: {
        id: profile.id,
        firstName: profile.localizedFirstName,
        lastName: profile.localizedLastName
      },
      instructions: [
        '1. Copy the access token below',
        '2. Add it to your .env.local file as LINKEDIN_ACCESS_TOKEN',
        '3. Restart your development server',
        '4. Your LinkedIn API will now fetch real data!'
      ]
    });

  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return NextResponse.json({ 
      error: 'Failed to complete LinkedIn authentication',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 