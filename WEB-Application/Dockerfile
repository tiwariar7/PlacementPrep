# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application and data files into the container at /app
COPY app.py .
COPY users.json .
COPY top-paying_roles_first.csv .
COPY top-paying_roles_first1.csv .
COPY Skill-Matching.csv .

# Copy the companies.ts file from the frontend source to the container's app directory
# This is required by the parser in app.py
COPY Next-Frontend/src/data/companies.ts companies.ts

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variables (can be overridden)
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Run app.py when the container launches using Gunicorn
CMD ["gunicorn", "--workers", "4", "--bind", "0.0.0.0:5000", "app:app"] 