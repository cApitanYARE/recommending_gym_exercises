# buiulder
FROM python:3.10-slim as builder

WORKDIR /install

RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    python3-dev \
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt

#final
FROM python:3.10-slim

WORKDIR /code

COPY --from=builder /install /usr/local

COPY api.py .
COPY model/ model/

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]