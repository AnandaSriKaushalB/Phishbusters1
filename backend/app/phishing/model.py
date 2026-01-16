import torch
import torch.nn as nn

class MultiModalAttentionNetwork(nn.Module):
    def __init__(self, semantic_dim=384, behavioral_dim=8, hidden_dim=128):
        super().__init__()
        self.semantic_encoder = nn.Sequential(
            nn.Linear(semantic_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, hidden_dim)
        )
        self.behavioral_encoder = nn.Sequential(
            nn.Linear(behavioral_dim, hidden_dim // 2),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim // 2, hidden_dim)
        )
        self.attention = nn.MultiheadAttention(hidden_dim, num_heads=4, batch_first=True)
        self.fusion_layer = nn.Sequential(
            nn.Linear(hidden_dim * 2, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 1)
        )

    def forward(self, semantic_features, behavioral_features):
        semantic_encoded = self.semantic_encoder(semantic_features)
        behavioral_encoded = self.behavioral_encoder(behavioral_features)
        semantic_attn = semantic_encoded.unsqueeze(1)
        behavioral_attn = behavioral_encoded.unsqueeze(1)
        semantic_attended, _ = self.attention(semantic_attn, behavioral_attn, behavioral_attn)
        behavioral_attended, _ = self.attention(behavioral_attn, semantic_attn, semantic_attn)
        fused = torch.cat([
            semantic_attended.squeeze(1), behavioral_attended.squeeze(1)
        ], dim=1)
        output = torch.sigmoid(self.fusion_layer(fused))
        return output
