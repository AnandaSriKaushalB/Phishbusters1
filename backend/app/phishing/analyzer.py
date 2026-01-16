import re
import random
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split

from app.phishing.model import MultiModalAttentionNetwork
from app.phishing.dataset import EnhancedPhishingDataset
from app.phishing.features import AdvancedFeatureExtractor

# Global model instances
model = None
feature_extractor = None
device = None

def initialize_model():
    """Initialize and train the phishing detection model"""
    global model, feature_extractor, device

    print("🔄 Initializing phishing detection model...")

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    feature_extractor = AdvancedFeatureExtractor()

    # Generate training data
    dataset_gen = EnhancedPhishingDataset()
    df = dataset_gen.generate_dataset(500)

    X_semantic = feature_extractor.semantic(df['full_text'].tolist())
    X_behavioral = feature_extractor.behavioral(df)
    y = torch.FloatTensor(df['label'].values).unsqueeze(1)

    X_train_s, X_test_s, X_train_b, X_test_b, y_train, y_test = train_test_split(
        X_semantic, X_behavioral, y, test_size=0.2, random_state=42, stratify=y
    )

    model = MultiModalAttentionNetwork(
        semantic_dim=X_semantic.shape[1],
        behavioral_dim=X_behavioral.shape[1]
    ).to(device)

    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-5)

    # Quick training
    for epoch in range(3):
        model.train()
        optimizer.zero_grad()
        outputs = model(X_train_s.to(device), X_train_b.to(device))
        loss = criterion(outputs, y_train.to(device))
        loss.backward()
        optimizer.step()

        model.eval()
        with torch.no_grad():
            val_out = model(X_test_s.to(device), X_test_b.to(device))
            val_preds = (val_out > 0.5).float()
            val_acc = (val_preds == y_test.to(device)).float().mean().item()
        print(f"  Epoch {epoch + 1}/3 | Loss: {loss.item():.4f} | Val Acc: {val_acc:.4f}")

    print("✅ Model initialized successfully")

def advanced_risk_assessment(text: str):
    """Rule-based risk assessment"""
    text_lower = text.lower()

    critical_keywords = [
        'urgent', 'verify account', 'suspended', 'permanently blocked', 'blocked',
        'immediately', 'click the link', 'click here', 'limited time',
        'restore access', 'confirm your payment', 'security alert',
        'permanent suspension', 'action required', 'cvv', 'password'
    ]
    suspicious_patterns = [
        'click', 'update', 'confirm', 'verify', 'login', 'payment',
        'billing', 'address', 'restore', 'security', 'account', 'risk'
    ]

    url_matches = re.findall(r'http[s]?://[^\s<>"\']+', text_lower)
    domain_score = 0
    for url in url_matches:
        if any(b in url for b in ['paypal', 'amazon', 'bank', 'apple']):
            if any(s in url for s in ['verify', 'security', 'confirm', 'login']):
                domain_score += 20

    critical_score = sum(15 for kw in critical_keywords if kw in text_lower)
    suspicious_score = sum(5 for pat in suspicious_patterns if pat in text_lower)
    urgency_score = text_lower.count('immediately') * 8 + text_lower.count('now') * 4
    exclamation_score = min(3, text.count('!')) * 2
    caps_score = sum(1 for w in text.split() if w.isupper()) * 3

    score = critical_score + suspicious_score + urgency_score + exclamation_score + caps_score + domain_score
    score = min(100, score)

    if score >= 60:
        category = 'Fraudulent'
        confidence = min(97, 77 + (score - 60) * 0.8)
    elif score >= 35:
        category = 'Suspicious'
        confidence = min(85, 62 + (score - 35) * 0.7)
    else:
        category = 'Safe'
        confidence = max(88, 97 - score * 0.2)

    return score, category, round(confidence, 1)

def analyze_email(text: str) -> dict:
    """Complete email analysis"""
    global model, feature_extractor, device

    # Rule-based assessment
    risk_score, category, confidence = advanced_risk_assessment(text)

    # ML probability
    ml_prob = 0.5
    if model is not None and feature_extractor is not None:
        semantic = feature_extractor.semantic([text]).to(device)
        behavioral = torch.zeros((1, 8), dtype=torch.float).to(device)
        model.eval()
        with torch.no_grad():
            ml_prob = float(model(semantic, behavioral).item())

    # Adjust confidence based on ML
    if (category == 'Fraudulent' and ml_prob > 0.6) or (category == 'Safe' and ml_prob < 0.3):
        confidence = min(99, confidence + 4)
    elif (category == 'Fraudulent' and ml_prob < 0.3) or (category == 'Safe' and ml_prob > 0.7):
        confidence = max(50, confidence - 12)

    # Additional metrics
    words = text.split()
    word_count = len(words)
    url_count = len(re.findall(r'http[s]?://[^\s<>"\']+', text))

    suspicious_keywords = ['urgent', 'verify', 'account', 'password', 'click', 'login', 'security', 'payment']
    keyword_count = sum(1 for w in words if any(k in w.lower() for k in suspicious_keywords))

    return {
        "category": category,
        "confidence": round(min(max(confidence, 0), 99.9), 1),
        "risk_score": risk_score,
        "ml_probability": round(ml_prob * 100, 1),
        "word_count": word_count,
        "url_count": url_count,
        "suspicious_keyword_count": keyword_count,
        "urgency_level": "High" if 'immediately' in text.lower() or 'urgent' in text.lower() else "Normal",
    }
