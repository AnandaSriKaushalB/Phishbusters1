import torch
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

class AdvancedFeatureExtractor:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.sentence_model = SentenceTransformer(model_name)

    def semantic(self, texts):
        if isinstance(texts, str):
            texts = [texts]
        embeddings = self.sentence_model.encode(texts, convert_to_tensor=False)
        return torch.FloatTensor(embeddings)

    def behavioral(self, df):
        cols = [
            'mouse_entropy', 'click_hesitation', 'scroll_anomaly', 'hover_duration',
            'typing_variance', 'session_time', 'return_visits', 'forward_attempts'
        ]
        arr = df[cols].values if isinstance(df, pd.DataFrame) else np.asarray(df)
        return torch.FloatTensor(arr)
