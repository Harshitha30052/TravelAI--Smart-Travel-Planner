FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY ml/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY ml/ /app/ml/

EXPOSE 8000

ENV PYTHONPATH=/app

CMD ["python", "ml/api/predict_api.py"]
