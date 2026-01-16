import httpx
import base64
from typing import List, Dict

GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1/users/me"


async def fetch_emails(access_token: str, max_results: int = 10) -> List[Dict]:
    """
    Fetch latest emails from Gmail API and parse them into a simplified structure.
    """
    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient() as client:
        # Get message list
        list_response = await client.get(
            f"{GMAIL_API_BASE}/messages",
            headers=headers,
            params={"maxResults": max_results},
        )

        if list_response.status_code != 200:
            raise Exception(f"Failed to fetch messages: {list_response.text}")

        messages = list_response.json().get("messages", [])
        emails: List[Dict] = []

        # Fetch each message details
        for msg in messages:
            msg_response = await client.get(
                f"{GMAIL_API_BASE}/messages/{msg['id']}",
                headers=headers,
                params={"format": "full"},
            )

            if msg_response.status_code != 200:
                continue

            msg_data = msg_response.json()
            email = parse_email(msg_data)
            emails.append(email)

    return emails


async def fetch_email_by_id(access_token: str, message_id: str) -> Dict:
    """
    Fetch a single Gmail message by ID with full headers and body.
    """
    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GMAIL_API_BASE}/messages/{message_id}",
            headers=headers,
            params={"format": "full"},
        )

    if resp.status_code != 200:
        raise Exception(f"Failed to fetch message: {resp.text}")

    msg_data = resp.json()
    return parse_email(msg_data)


def parse_email(msg_data: dict) -> dict:
    """
    Parse Gmail API message response into a simpler dict with full body and key headers.
    """
    headers = msg_data.get("payload", {}).get("headers", [])

    def get_header(name: str) -> str:
        return next(
            (h["value"] for h in headers if h["name"].lower() == name.lower()),
            "",
        )

    # Extract body text (full)
    body = ""
    payload = msg_data.get("payload", {})

    if "body" in payload and payload["body"].get("data"):
        body = base64.urlsafe_b64decode(payload["body"]["data"]).decode(
            "utf-8", errors="ignore"
        )
    elif "parts" in payload:
        for part in payload["parts"]:
            if part.get("mimeType") == "text/plain" and part.get("body", {}).get("data"):
                body = base64.urlsafe_b64decode(part["body"]["data"]).decode(
                    "utf-8", errors="ignore"
                )
                break

    return {
        "id": msg_data.get("id"),
        "thread_id": msg_data.get("threadId"),
        "subject": get_header("Subject"),
        "from": get_header("From"),
        "to": get_header("To"),
        "date": get_header("Date"),  # arrival time
        "snippet": msg_data.get("snippet", ""),
        "body": body,                # full body, no truncation
    }
