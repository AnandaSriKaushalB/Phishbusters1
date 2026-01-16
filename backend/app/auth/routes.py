from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from datetime import datetime

from app.auth.oauth2 import get_google_auth_url, exchange_code_for_tokens, get_google_user_info
from app.auth.jwt_handler import create_access_token
from app.db.mongodb import get_database
from app.config import settings

router = APIRouter()

@router.get("/google/login")
async def google_login():
    """
    Step 1: Return Google OAuth2 authorization URL to the frontend.
    Frontend will redirect the browser to this URL.
    """
    url = get_google_auth_url()
    return {"url": url}

@router.get("/google/callback")
async def google_callback(code: str):
    """
    Step 2: Google redirects here with ?code=...
    Exchange code for tokens, get user info, store in DB, then redirect to frontend
    with a JWT token in the query string.
    """
    try:
        # 1) Exchange code for tokens
        tokens = await exchange_code_for_tokens(code)
        print("TOKENS:", tokens)

        access_token = tokens.get("access_token")
        refresh_token = tokens.get("refresh_token")

        if not access_token:
            raise Exception("No access_token returned from Google")

        # 2) Get user info
        user_info = await get_google_user_info(access_token)
        print("USER INFO:", user_info)

        # 3) Upsert user in DB
        db = get_database()
        user_data = {
            "google_id": user_info["id"],
            "email": user_info["email"],
            "name": user_info.get("name", ""),
            "picture": user_info.get("picture", ""),
            "gmail_access_token": access_token,
            "gmail_refresh_token": refresh_token,
            "updated_at": datetime.utcnow(),
        }

        existing = await db.users.find_one({"google_id": user_info["id"]})
        if existing:
            await db.users.update_one(
                {"google_id": user_info["id"]},
                {"$set": user_data},
            )
            user_id = str(existing["_id"])
        else:
            user_data["created_at"] = datetime.utcnow()
            result = await db.users.insert_one(user_data)
            user_id = str(result.inserted_id)

        # 4) Create JWT for frontend
        jwt_token = create_access_token({
            "sub": user_id,
            "email": user_info["email"],
            "google_id": user_info["id"],
        })

        redirect_url = f"{settings.frontend_url}/auth/callback?token={jwt_token}"
        print("REDIRECTING TO FRONTEND:", redirect_url)
        return RedirectResponse(url=redirect_url)

    except Exception as e:
        print("CALLBACK ERROR:", repr(e))
        raise HTTPException(status_code=400, detail=str(e))
