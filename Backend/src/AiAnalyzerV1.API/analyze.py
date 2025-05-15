import torch
from transformers import RobertaTokenizer, RobertaModel
from torch import nn

MAX_LEN = 128
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class ReviewModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.roberta = RobertaModel.from_pretrained('roberta-base')
        self.lstm = nn.LSTM(
            input_size=768,
            hidden_size=256,
            num_layers=1,
            bidirectional=True,
            batch_first=True
        )
        self.sentiment_classifier = nn.Linear(512, 3) 
        self.bot_detector = nn.Linear(512, 1)        

    def forward(self, input_ids, attention_mask, stars):
        roberta_output = self.roberta(
            input_ids=input_ids,
            attention_mask=attention_mask
        ).last_hidden_state
        lstm_output, _ = self.lstm(roberta_output)
        pooled_output = torch.mean(lstm_output, dim=1)
        sentiment_logits = self.sentiment_classifier(pooled_output)
        bot_prob = torch.sigmoid(self.bot_detector(pooled_output))
        return sentiment_logits, bot_prob

model = ReviewModel().to(device)
model.load_state_dict(torch.load("review_model.pt", map_location=device))
model.eval() 

tokenizer = RobertaTokenizer.from_pretrained('roberta-base')

def analyze_reviews(reviews):
    bot_count = 0
    sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}

    for review in reviews:
        encoding = tokenizer(
            review["content"],
            max_length=MAX_LEN,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )
        input_ids = encoding["input_ids"].to(device)
        attention_mask = encoding["attention_mask"].to(device)
        stars = torch.tensor([review["stars"]], dtype=torch.long).to(device)

        with torch.no_grad():
            sentiment_logits, bot_prob = model(input_ids, attention_mask, stars)

        is_bot = bot_prob.item() > 0.5
        sentiment = torch.argmax(sentiment_logits).item()

        if is_bot:
            bot_count += 1

        if sentiment == 0:
            sentiment_counts["positive"] += 1
        elif sentiment == 1:
            sentiment_counts["neutral"] += 1
        else:
            sentiment_counts["negative"] += 1

    total = len(reviews)
    reliability = f"{100 - (bot_count / total) * 100:.0f}%"
    positive = f"{(sentiment_counts['positive'] / total) * 100:.0f}%"
    neutral = f"{(sentiment_counts['neutral'] / total) * 100:.0f}%"
    negative = f"{(sentiment_counts['negative'] / total) * 100:.0f}%"

    return {
        "reliability": reliability,
        "positive": positive,
        "neutral": neutral,
        "negative": negative
    }
