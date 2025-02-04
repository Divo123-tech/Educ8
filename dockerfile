# Use an official Python image
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy dependency files
COPY server/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY server /app

# Run makemigrations (if needed) and migrate
RUN python manage.py makemigrations && python manage.py migrate

# Expose the port
EXPOSE 8000

# Run the server with Uvicorn
CMD ["uvicorn", "server.asgi:application", "--host", "0.0.0.0", "--port", "8000"]
