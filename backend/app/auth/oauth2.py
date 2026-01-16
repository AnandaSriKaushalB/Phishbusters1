import httpx

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

# Your OAuth client credentials
CLIENT_ID = "Your-Google-Client-ID"
CLIENT_SECRET = "Your-Google-Client-Secret"
REDIRECT_URI = "http://localhost:8000/auth/google/callback"


def get_google_auth_url() -> str:
    """
    Build the Google OAuth2 authorization URL.
    """
    params = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": "openid email profile https://www.googleapis.com/auth/gmail.readonly",
        "access_type": "offline",
        "prompt": "consent",
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{GOOGLE_AUTH_URL}?{query}"


async def exchange_code_for_tokens(code: str) -> dict:
    """
    Exchange authorization code for access/refresh tokens.
    """
    data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    # Debug (optional, remove later)
    print("TOKEN REQUEST DATA:", {k: (v if k != "client_secret" else "***") for k, v in data.items()})

    async with httpx.AsyncClient() as client:
        response = await client.post(GOOGLE_TOKEN_URL, data=data)

    print("TOKEN RESPONSE:", response.status_code, response.text)

    if response.status_code != 200:
        # This is what surfaces as 400 in your callback
        raise Exception(f"Token exchange failed: {response.text}")

    return response.json()


async def get_google_user_info(access_token: str) -> dict:
    """
    Get user info from Google using access token.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )

    if response.status_code != 200:
        raise Exception("Failed to get user info")

    return response.json()
