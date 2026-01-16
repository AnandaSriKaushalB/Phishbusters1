from fastapi import APIRouter, HTTPException, Depends
from app.auth.jwt_handler import get_current_user
from app.db.mongodb import get_database
from app.gmail.service import (
    fetch_emails,
    fetch_email_by_id,
)
from app.phishing.analyzer import analyze_email
import traceback


router = APIRouter()


@router.get("/emails")
async def get_emails(
    max_results: int = 10,
    user: dict = Depends(get_current_user),
):
    """
    List latest emails for the current Google user, each with summary analysis.
    """
    db = get_database()

    try:
        # --- identify user ---
        google_id = user.get("google_id")
        if not google_id:
            raise HTTPException(status_code=401, detail="Google account not linked")

        user_doc = await db.users.find_one({"google_id": google_id})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")

        access_token = user_doc.get("gmail_access_token")
        if not access_token:
            raise HTTPException(
                status_code=401,
                detail="Gmail not connected for this user",
            )

        # --- fetch emails from Gmail ---
        emails = await fetch_emails(access_token, max_results) or []
        # ensure list type
        if not isinstance(emails, list):
            raise HTTPException(status_code=502, detail="Invalid Gmail response")

        # --- analyze each email ---
        analyzed_emails = []
        for email in emails:
            subject = email.get("subject", "") or ""
            body = email.get("body", "") or ""
            full_text = f"{subject} {body}"
            analysis = analyze_email(full_text)
            analyzed_emails.append({**email, "analysis": analysis})

        return {"emails": analyzed_emails, "count": len(analyzed_emails)}

    except HTTPException:
        raise
    except Exception as e:
        # print full traceback so you can see the real error in the console
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/emails/{message_id}")
async def get_email_detail(
    message_id: str,
    user: dict = Depends(get_current_user),
):
    """
    Get full email content and detailed phishing analysis for a single message.
    Use this when user clicks on an email to see full read‑only view + metrics.
    """
    db = get_database()

    try:
        google_id = user.get("google_id")
        if not google_id:
            raise HTTPException(status_code=401, detail="Google account not linked")

        user_doc = await db.users.find_one({"google_id": google_id})
        if not user_doc:
            raise HTTPException(status_code=404, detail="User not found")

        access_token = user_doc.get("gmail_access_token")
        if not access_token:
            raise HTTPException(
                status_code=401,
                detail="Gmail not connected for this user",
            )

        # Full email (headers + body)
        email = await fetch_email_by_id(access_token, message_id)
        if not email:
            raise HTTPException(status_code=502, detail="Failed to load email")

        # Detailed analysis based on full text
        subject = email.get("subject", "") or ""
        body = email.get("body", "") or ""
        full_text = f"{subject} {body}"
        analysis = analyze_email(full_text)

        return {"email": email, "analysis": analysis}

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze")
async def analyze_text(
    data: dict,
    user: dict = Depends(get_current_user),
):
    """
    Analyze custom free‑text for phishing without using Gmail.
    """
    text = data.get("text", "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")

    analysis = analyze_email(text)
    return {"analysis": analysis}
