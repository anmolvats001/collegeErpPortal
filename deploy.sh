#!/bin/bash
set -e

echo "===================================================="
echo "    College ERP Portal - One-Click Deployment       "
echo "===================================================="

# Update & Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "[1/4] Installing Docker and Docker Compose..."
    sudo apt-get update -y
    sudo apt-get install -y docker.io docker-compose git
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER
else
    echo "[1/4] Docker is already installed."
fi

# Ensure docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    sudo apt-get install -y docker-compose
fi

echo "[2/4] Pulling latest updates from GitHub..."
git pull origin main

echo "[3/4] Building and launching all services with Docker Compose..."
sudo docker-compose -f docker-compose.prod.yml up -d --build

echo "[4/4] Verifying running containers..."
sudo docker ps

echo "===================================================="
echo " SUCCESS! Your ERP is live on port 80!"
echo " Open http://<YOUR_AZURE_PUBLIC_IP> in your browser."
echo "===================================================="
