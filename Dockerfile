# Root Dockerfile builds the backend image for single-service deployments
# (e.g. Render). For local full-stack dev, use docker-compose.yml instead.
FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
