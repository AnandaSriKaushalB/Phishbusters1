import random
import re
import pandas as pd

class EnhancedPhishingDataset:
    def __init__(self):
        pass

    def generate_dataset(self, n_samples=1000):
        phishing_templates = [
            {"subject": "URGENT: Your {service} account will be suspended",
             "body": "We detected suspicious activity. Click here immediately to verify: {url}",
             "service": ["PayPal","Amazon","Netflix","Bank","Apple"]},
            {"subject": "Security Alert: Unusual login detected from {location}",
             "body": "Someone tried to access your account from {location}. Confirm your identity now: {url}",
             "service": ["Gmail","Facebook","Microsoft","Instagram"]},
            {"subject": "Action Required: Verify your {service} payment information",
             "body": "Your payment failed. Update your billing info ASAP or service will be suspended: {url}",
             "service": ["Netflix","Spotify","Adobe","PayPal"]},
            {"subject": "Your package delivery failed - Action needed",
             "body": "We couldn't deliver your package. Click to reschedule: {url}",
             "service": ["FedEx","UPS","USPS","DHL"]},
            {"subject": "FINAL NOTICE: Account suspension in 24 hours",
             "body": "This is your last chance to verify your account before permanent suspension. Act now: {url}",
             "service": ["Bank","PayPal","Amazon"]}
        ]

        legitimate_templates = [
            {"subject": "Weekly team meeting reminder",
             "body": "Hi team, just a reminder about our weekly sync tomorrow at 2 PM. See you there!",
             "service": ["Company"]},
            {"subject": "Monthly newsletter - {month}",
             "body": "Check out this month's updates, articles, and company news in our latest newsletter.",
             "service": ["Newsletter"]},
            {"subject": "Invoice #{invoice_num} for your recent purchase",
             "body": "Thank you for your purchase. Please find attached invoice for your records.",
             "service": ["Company"]},
            {"subject": "Your order has shipped",
             "body": "Good news! Your order #{order_num} has been shipped and will arrive in 3-5 business days.",
             "service": ["Amazon","Store"]},
            {"subject": "Receipt for your subscription",
             "body": "Your monthly subscription payment of ${amount} has been processed. Thank you.",
             "service": ["Service"]}
        ]

        locations = ["New York", "London", "Tokyo", "Moscow", "Unknown Location"]
        months = ["January", "February", "March", "April", "May"]

        data = []
        for i in range(n_samples):
            is_phish = random.random() < 0.5
            if is_phish:
                template = random.choice(phishing_templates)
                service = random.choice(template["service"])
                location = random.choice(locations)
                subject = template["subject"].format(service=service, location=location)
                body = template["body"].format(
                    service=service,
                    location=location,
                    url=f"http://{service.lower()}-verify-{random.randint(1000,9999)}.com/login"
                )
            else:
                template = random.choice(legitimate_templates)
                service = random.choice(template["service"])
                month = random.choice(months)
                subject = template["subject"].format(
                    service=service, month=month,
                    invoice_num=random.randint(10000,99999),
                    order_num=random.randint(100000,999999)
                )
                body = template["body"].format(
                    service=service,
                    amount=random.randint(10,100),
                    invoice_num=random.randint(10000,99999),
                    order_num=random.randint(100000,999999)
                )

            label = 1 if is_phish else 0
            semantic_features = self._generate_semantic_features(subject + " " + body, is_phish)
            behavioral_features = self._generate_behavioral_features(is_phish)

            data.append({
                "email_id": i,
                "subject": subject,
                "body": body,
                "full_text": subject + " " + body,
                "label": label,
                **semantic_features,
                **behavioral_features
            })
        return pd.DataFrame(data)

    def _generate_semantic_features(self, text, is_phish):
        url_count = len(re.findall(r'http[s]?://\S+', text))
        urgency_words = [
            'urgent', 'immediate', 'asap', 'now', 'quickly', 'expire',
            'suspended', 'verify', 'confirm', 'act now', 'limited time',
            'final notice', 'action required'
        ]
        urgency_score = sum(1 for w in urgency_words if w.lower() in text.lower()) / max(1, len(urgency_words))
        misspelling_score = random.uniform(0.1, 0.4) if is_phish else random.uniform(0.0, 0.05)
        return {
            "url_count": url_count,
            "urgency_score": urgency_score,
            "text_length": len(text),
            "word_count": len(text.split()),
            "misspelling_score": misspelling_score,
            "exclamation_count": text.count('!'),
            "capital_ratio": sum(1 for c in text if c.isupper()) / len(text) if len(text) > 0 else 0
        }

    def _generate_behavioral_features(self, is_phish):
        if is_phish:
            return {
                'mouse_entropy': random.uniform(0.7, 1.0),
                'click_hesitation': random.uniform(5, 15),
                'scroll_anomaly': random.uniform(0.6, 1.0),
                'hover_duration': random.uniform(2, 8),
                'typing_variance': random.uniform(0.5, 1.0),
                'session_time': random.uniform(30, 300),
                'return_visits': random.randint(0, 3),
                'forward_attempts': random.randint(0, 5)
            }
        else:
            return {
                'mouse_entropy': random.uniform(0.1, 0.4),
                'click_hesitation': random.uniform(0.5, 2),
                'scroll_anomaly': random.uniform(0.0, 0.3),
                'hover_duration': random.uniform(0.2, 1.5),
                'typing_variance': random.uniform(0.0, 0.2),
                'session_time': random.uniform(5, 50),
                'return_visits': random.randint(0, 1),
                'forward_attempts': random.randint(0, 1)
            }
