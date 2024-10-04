# Use an official Python runtime as a parent image
FROM python:3.11-alpine

# Set the working directory in the container
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set the FLASK_APP environment variable
ENV FLASK_APP=__init__.py

# Run the application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
