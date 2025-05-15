import torch
import torch.nn as nn
from transformers import RobertaModel, RobertaTokenizer
from torch.utils.data import Dataset, DataLoader
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

# Загрузка данных
df_train = pd.read_csv("train_data.csv")

# Преобразование текстовых меток в числа
sentiment_mapping = {"positive": 0, "neutral": 1, "negative": 2}
df_train["sentiment"] = df_train["sentiment"].map(sentiment_mapping)

# Загрузка RoBERTa
MODEL_NAME = 'roberta-base'
tokenizer = RobertaTokenizer.from_pretrained(MODEL_NAME)
roberta_model = RobertaModel.from_pretrained(MODEL_NAME)

# Параметры
MAX_LEN = 128
BATCH_SIZE = 16
EPOCHS = 150
LEARNING_RATE = 1e-5
#device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
device = torch.device('cuda')

# Датасет
class ReviewDataset(Dataset):
    def __init__(self, texts, stars, sentiments, is_bot):
        self.texts = texts
        self.stars = stars
        self.sentiments = sentiments
        self.is_bot = is_bot

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        encoding = tokenizer(
            text,
            max_length=MAX_LEN,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        )
        return {
            "input_ids": encoding["input_ids"].flatten(),
            "attention_mask": encoding["attention_mask"].flatten(),
            "stars": torch.tensor(self.stars[idx], dtype=torch.long),
            "sentiment": torch.tensor(self.sentiments[idx], dtype=torch.long),
            "is_bot": torch.tensor(self.is_bot[idx], dtype=torch.float)
        }

# Модель
class ReviewModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.roberta = roberta_model
        self.lstm = nn.LSTM(
            input_size=768,
            hidden_size=256,
            num_layers=1,
            bidirectional=True,
            batch_first=True
        )
        self.sentiment_classifier = nn.Linear(512, 3)  # 3 класса
        self.bot_detector = nn.Linear(512, 1)         # Бинарная классификация

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

# Подготовка данных
texts = df_train["content"].tolist()
stars = df_train["stars"].tolist()
sentiments = df_train["sentiment"].tolist()
is_bot = df_train["is_bot"].tolist()

X_train, X_val, y_stars_train, y_stars_val, y_sent_train, y_sent_val, y_bot_train, y_bot_val = train_test_split(
    texts, stars, sentiments, is_bot, test_size=0.2, random_state=42
)

train_dataset = ReviewDataset(X_train, y_stars_train, y_sent_train, y_bot_train)
val_dataset = ReviewDataset(X_val, y_stars_val, y_sent_val, y_bot_val)

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE)

# Обучение
model = ReviewModel().to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)
sentiment_loss = nn.CrossEntropyLoss()
bot_loss = nn.BCELoss()

for epoch in range(EPOCHS):
    model.train()
    for batch in train_loader:
        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        stars = batch["stars"].to(device)
        sentiment = batch["sentiment"].to(device)
        is_bot = batch["is_bot"].to(device)

        optimizer.zero_grad()
        sentiment_logits, bot_prob = model(input_ids, attention_mask, stars)

        loss_sent = sentiment_loss(sentiment_logits, sentiment)
        loss_bot = bot_loss(bot_prob.flatten(), is_bot)
        total_loss = loss_sent + loss_bot

        total_loss.backward()
        optimizer.step()

    print(f"Epoch {epoch + 1}, Loss: {total_loss.item()}")

# Сохранение модели
torch.save(model.state_dict(), "review_model.pt")
print("Модель сохранена в review_model.pt")