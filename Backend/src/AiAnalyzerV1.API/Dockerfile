FROM python:3.10-slim

WORKDIR /app

COPY src/AiAnalyzerV1.API/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src/AiAnalyzerV1.API/controller.py .
COPY src/AiAnalyzerV1.API/analyze.py .

EXPOSE 5101

CMD ["python", "controller.py"]
