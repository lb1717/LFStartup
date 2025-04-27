#!/bin/bash

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
fi

# Add all files
git add .

# Commit changes
git commit -m "Deploy to GitHub Pages"

# Check if remote exists
if ! git remote | grep -q "origin"; then
  echo "Please enter your GitHub repository URL:"
  read repo_url
  git remote add origin $repo_url
fi

# Push to GitHub
git push -u origin main

echo "Code pushed to GitHub. The GitHub Actions workflow will automatically deploy to GitHub Pages."
echo "Make sure you've set up the repository secrets for Supabase credentials in your GitHub repository settings." 