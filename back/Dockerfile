# Builder stage
FROM python:3.10-alpine as builder

RUN apk add --no-cache --virtual .build-deps \
        gcc \
        g++ \
        musl-dev \
        python3-dev \
        openblas-dev \
        linux-headers \
        && apk add --no-cache openblas

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir \
        --no-compile \
        --disable-pip-version-check \
        --no-binary :all: \
        -r requirements.txt || \
    pip install --no-cache-dir \
        --no-compile \
        --disable-pip-version-check \
        -r requirements.txt


# Final stage
FROM python:3.10-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONOPTIMIZE=2

WORKDIR /code

RUN apk add --no-cache libgomp libstdc++

# Копіюємо Python пакети
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
# Копіюємо виконувані файли (включаючи uvicorn)
COPY --from=builder /usr/local/bin /usr/local/bin

# Очищаємо зайві файли
RUN set -ex && \
    cd /usr/local/lib/python3.10/site-packages && \
    find . -type d \( -name "test*" -o -name "*test" -o -name "tests" \) -exec rm -rf {} + 2>/dev/null || true && \
    find . -type d \( -name "docs" -o -name "examples" -o -name "doc" -o -name "example" \) -exec rm -rf {} + 2>/dev/null || true && \
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true && \
    find . -type f -name "*.pyc" -delete && \
    find . -type f -name "*.pyo" -delete && \
    rm -rf numpy/doc numpy/core/tests numpy/random/tests 2>/dev/null || true && \
    rm -rf sklearn/datasets/data sklearn/datasets/images sklearn/datasets/descr sklearn/externals 2>/dev/null || true && \
    rm -rf scipy/linalg/tests scipy/sparse/tests scipy/optimize/tests scipy/stats/tests scipy/io/matlab/tests 2>/dev/null || true && \
    rm -rf pandas/tests pandas/_libs/tests 2>/dev/null || true && \
    rm -rf matplotlib/tests matplotlib/mpl-data/sample_data 2>/dev/null || true && \
    find . -name "*.so" -exec strip --strip-all {} \; 2>/dev/null || true && \
    find . -name "*.py" -size +500k -exec rm -f {} \; 2>/dev/null || true && \
    rm -rf pip* setuptools* wheel* *dist-info 2>/dev/null || true && \
    find . -name "*.pyi" -delete 2>/dev/null || true && \
    cd /

# Копіюємо файли додатку
COPY api.py .
COPY model/ model/


# Очищаємо __pycache__
RUN find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true

# Перевіряємо, що uvicorn доступний
RUN which uvicorn || (echo "uvicorn not found in PATH" && exit 1)

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]