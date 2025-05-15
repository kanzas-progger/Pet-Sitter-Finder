FROM python:3.10-slim

WORKDIR /app

COPY src/AiAnalyzerV2.API/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src/AiAnalyzerV2.API/ .

EXPOSE 5100

CMD ["python", "controller.py"]
