#!/bin/bash

# Configuration
SERVICE_NAME="netriq-ai"
REGION="us-central1" # Change to your preferred region
# Fix for gcloud path on some Mac environments
if ! command -v gcloud &> /dev/null; then
    if [ -f "/opt/homebrew/bin/gcloud" ]; then
        export PATH="/opt/homebrew/bin:$PATH"
    elif [ -f "/usr/local/bin/gcloud" ]; then
        export PATH="/usr/local/bin:$PATH"
    fi
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No GCP project detected. Please run 'gcloud init' first."
    exit 1
fi

echo "🚀 Deploying $SERVICE_NAME to GCP Cloud Run in $REGION..."

# Ensure .env.yaml exists
if [ ! -f .env.yaml ]; then
    echo "⚠️  .env.yaml not found. Creating a template..."
    echo "RESEND_API_KEY: \"your_api_key_here\"" > .env.yaml
    echo "Please update .env.yaml with your secrets before deploying."
    exit 1
fi

# Deploy to Cloud Run with secrets securely loaded from Secret Manager
gcloud run deploy $SERVICE_NAME \
    --source . \
    --region $REGION \
    --allow-unauthenticated \
    --memory 512Mi \
    --env-vars-file .env.yaml \
    --set-secrets="RESEND_API_KEY=resend-api-key:latest,SUPABASE_KEY=supabase-key:latest,SUPABASE_SERVICE_KEY=supabase-service-key:latest" \
    --project $PROJECT_ID

echo "✅ Deployment complete!"
