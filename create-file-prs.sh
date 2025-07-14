#!/bin/bash

# Script to create separate PRs for each changed file
# This allows testing each change individually with GitHub Actions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to sanitize branch name
sanitize_branch_name() {
    local file_path="$1"
    # Replace special characters with hyphens and remove leading/trailing hyphens
    echo "$file_path" | sed 's/[^a-zA-Z0-9._-]/-/g' | sed 's/^-*//;s/-*$//' | tr '[:upper:]' '[:lower:]'
}

# Function to get current branch
get_current_branch() {
    git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD
}

# Function to check if branch exists
branch_exists() {
    local branch_name="$1"
    git show-ref --verify --quiet "refs/heads/$branch_name" 2>/dev/null
}

# Function to create PR for a single file
create_file_pr() {
    local file_path="$1"
    local original_branch="$2"
    
    print_status "Processing file: $file_path"
    
    # Create sanitized branch name
    local branch_name="feature/$(sanitize_branch_name "$file_path")"
    
    # If branch already exists, append timestamp
    if branch_exists "$branch_name"; then
        local timestamp=$(date +%s)
        branch_name="${branch_name}-${timestamp}"
        print_warning "Branch exists, using: $branch_name"
    fi
    
    # Create and switch to new branch
    git checkout -b "$branch_name" "$original_branch"
    
    # Add only this specific file
    if [[ -d "$file_path" ]]; then
        # If it's a directory, add all files in it
        git add "$file_path"
        local commit_message="Add directory: $file_path"
        local pr_title="Add directory: $file_path"
    else
        # If it's a single file
        git add "$file_path"
        if git diff --cached --quiet; then
            print_warning "No changes to commit for $file_path"
            git checkout "$original_branch"
            git branch -D "$branch_name"
            return 0
        fi
        
        local commit_message="Update file: $file_path"
        local pr_title="Update: $file_path"
    fi
    
    # Commit the file
    git commit -m "$commit_message"
    
    # Push the branch
    git push origin "$branch_name"
    
    # Create PR using GitHub CLI
    if command -v gh &> /dev/null; then
        local pr_body="This PR contains changes to \`$file_path\`.

**Changes:**
- File: \`$file_path\`
- Branch: \`$branch_name\`
- Base: \`$original_branch\`

This PR was automatically created to allow individual testing of file changes with GitHub Actions."
        
        gh pr create \
            --title "$pr_title" \
            --body "$pr_body" \
            --base "$original_branch" \
            --head "$branch_name"
        
        print_success "Created PR for $file_path"
    else
        print_error "GitHub CLI (gh) not found. Please install it to create PRs automatically."
        print_status "Branch $branch_name has been pushed. Create PR manually at:"
        print_status "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git.*/\1/')/compare/$original_branch...$branch_name"
    fi
    
    # Switch back to original branch
    git checkout "$original_branch"
}

# Main function
main() {
    print_status "Starting automatic PR creation for changed files..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository"
        exit 1
    fi
    
    # Get current branch
    local original_branch=$(get_current_branch)
    print_status "Current branch: $original_branch"
    
    # Check if we're in a rebase state
    if [[ -d "$(git rev-parse --git-dir)/rebase-merge" ]] || [[ -d "$(git rev-parse --git-dir)/rebase-apply" ]]; then
        print_warning "Currently in rebase state. You may want to complete the rebase first."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Exiting. Complete your rebase and run again."
            exit 0
        fi
    fi
    
    # Get list of changed files (modified and untracked)
    local modified_files=($(git diff --name-only))
    local untracked_files=($(git ls-files --others --exclude-standard))
    
    # Combine all changed files
    local all_files=("${modified_files[@]}" "${untracked_files[@]}")
    
    if [[ ${#all_files[@]} -eq 0 ]]; then
        print_status "No changed files found."
        exit 0
    fi
    
    print_status "Found ${#all_files[@]} changed files:"
    for file in "${all_files[@]}"; do
        echo "  - $file"
    done
    
    # Ask for confirmation
    echo
    read -p "Create separate PRs for each file? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Exiting without creating PRs."
        exit 0
    fi
    
    # Create PR for each file
    for file in "${all_files[@]}"; do
        create_file_pr "$file" "$original_branch"
    done
    
    print_success "Completed creating PRs for all changed files!"
    print_status "You can now test each change individually with GitHub Actions."
}

# Run main function
main "$@" 