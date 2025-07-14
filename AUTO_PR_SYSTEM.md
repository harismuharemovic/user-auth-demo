# Automatic File PR Creation System

This system automatically creates separate Pull Requests for each changed file, allowing you to test individual changes with GitHub Actions.

## Files Created

1. **`create-file-prs.sh`** - Main script that handles PR creation
2. **`.github/workflows/auto-file-prs.yml`** - GitHub Action workflow
3. **`AUTO_PR_SYSTEM.md`** - This documentation

## How It Works

The system detects all changed files (both modified and untracked) and creates a separate PR for each file. This allows you to:

- Test each change individually with GitHub Actions
- Review changes in isolation
- Merge changes selectively
- Identify which specific file changes cause issues

## Usage Options

### Option 1: Manual Script Execution

1. **Make the script executable:**

   ```bash
   chmod +x create-file-prs.sh
   ```

2. **Run the script:**

   ```bash
   ./create-file-prs.sh
   ```

3. **Follow the prompts:**
   - The script will show you all changed files
   - Confirm that you want to create PRs
   - It will create a branch and PR for each file

### Option 2: GitHub Actions (Automated)

1. **Go to the Actions tab** in your GitHub repository
2. **Find "Auto Create File PRs"** workflow
3. **Click "Run workflow"**
4. **Confirm the input** (create_prs: true)
5. **Click "Run workflow"** button

### Option 3: Automatic on Push (Optional)

Uncomment these lines in `.github/workflows/auto-file-prs.yml`:

```yaml
# push:
#   branches: [ main ]
```

This will automatically create PRs whenever you push to the main branch.

## Prerequisites

### For Manual Usage

- Git repository
- GitHub CLI (`gh`) installed and authenticated
- Bash shell

### For GitHub Actions

- Repository with Actions enabled
- Appropriate permissions (automatically handled)

## Branch Naming Convention

Branches are created with the pattern:

```
feature/[sanitized-file-path]
```

Examples:

- `src/components/Button.tsx` → `feature/src-components-button-tsx`
- `.github/workflows/test.yml` → `feature/-github-workflows-test-yml`
- `tasks 2/UI/task.md` → `feature/tasks-2-ui-task-md`

## PR Details

Each PR includes:

- **Title**: "Update: [file-path]" or "Add directory: [directory-path]"
- **Description**: Information about the file, branch, and purpose
- **Base branch**: Your current branch when the script runs
- **Labels**: Automatically created PRs get appropriate labels

## Current State Handling

The script handles various Git states:

- **Normal state**: Creates PRs normally
- **Rebase state**: Warns and asks for confirmation
- **Merge conflicts**: Handles appropriately
- **Clean state**: Notifies no changes found

## Error Handling

The script includes comprehensive error handling:

- Validates Git repository
- Checks for GitHub CLI availability
- Handles existing branch names (adds timestamp)
- Manages empty commits
- Provides colored output for better visibility

## Examples

### Current Changed Files

Based on your current git status:

1. **Modified file**: `.github/workflows/claude-code-review.yml`

   - Branch: `feature/-github-workflows-claude-code-review-yml`
   - PR Title: "Update: .github/workflows/claude-code-review.yml"

2. **Untracked directory**: `tasks 2/`
   - Branch: `feature/tasks-2`
   - PR Title: "Add directory: tasks 2/"

## Integration with Existing Workflows

This system works alongside your existing GitHub Actions:

1. **Claude Code Review** - Will run on each individual PR
2. **Tests** - Can run on each file change separately
3. **Linting** - Isolated to specific file changes
4. **Deployment** - Can be triggered per file if needed

## Customization

### Modify Branch Naming

Edit the `sanitize_branch_name()` function in `create-file-prs.sh`

### Change PR Template

Edit the `pr_body` variable in the `create_file_pr()` function

### Add Labels or Assignees

Modify the `gh pr create` command to include:

```bash
gh pr create \
    --title "$pr_title" \
    --body "$pr_body" \
    --base "$original_branch" \
    --head "$branch_name" \
    --label "auto-generated" \
    --assignee "@me"
```

## Troubleshooting

### Common Issues

1. **GitHub CLI not found**

   ```bash
   # Install GitHub CLI
   brew install gh  # macOS
   sudo apt install gh  # Ubuntu
   ```

2. **Permission denied**

   ```bash
   chmod +x create-file-prs.sh
   ```

3. **Authentication issues**

   ```bash
   gh auth login
   ```

4. **Branch already exists**
   - Script automatically appends timestamp
   - Or manually delete the branch: `git branch -D branch-name`

### Debug Mode

Add debug output by modifying the script:

```bash
set -x  # Add after set -e
```

## Best Practices

1. **Review before running** - Check what files will get PRs
2. **Complete rebase first** - Finish any ongoing rebase operations
3. **Test the workflow** - Start with a few files to test the process
4. **Monitor Actions** - Check that GitHub Actions run correctly on each PR
5. **Clean up** - Merge or close PRs as needed to avoid clutter

## Security Considerations

- Script uses current user's Git configuration
- GitHub Actions use repository secrets
- PRs are created with appropriate permissions
- No sensitive data is exposed in PR descriptions

## Next Steps

1. **Test the system** with your current changes
2. **Customize** branch naming or PR templates if needed
3. **Integrate** with your existing CI/CD pipeline
4. **Document** any project-specific modifications
