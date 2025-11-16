#!/bin/bash

# GITHUB REPOSITORY CLEANUP SCRIPT
# Date: 2025-11-16
# Purpose: Clean up duplicate and unused repositories
# WARNING: Review MASTER_REPOSITORY_INVENTORY.md before running!

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "GitHub Repository Cleanup Script"
echo "=========================================="
echo ""
echo -e "${YELLOW}WARNING: This script will help you delete repositories.${NC}"
echo -e "${YELLOW}Please review MASTER_REPOSITORY_INVENTORY.md first!${NC}"
echo ""
read -p "Have you reviewed the inventory and created backups? (yes/no): " CONFIRMED

if [ "$CONFIRMED" != "yes" ]; then
    echo -e "${RED}Aborted. Please review the inventory first.${NC}"
    exit 1
fi

# GitHub username
GH_USER="absulysuly"

# Create backup directory
BACKUP_DIR="$HOME/github-archive-$(date +%Y-%m-%d)"
echo -e "${GREEN}Creating backup directory: $BACKUP_DIR${NC}"
mkdir -p "$BACKUP_DIR"

# Function to archive a repo
archive_repo() {
    local repo=$1
    echo -e "${YELLOW}Archiving: $repo${NC}"

    if [ ! -d "$BACKUP_DIR/$repo" ]; then
        git clone "https://github.com/$GH_USER/$repo.git" "$BACKUP_DIR/$repo" 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Archived: $repo${NC}"
        else
            echo -e "${RED}✗ Failed to archive: $repo${NC}"
        fi
    else
        echo -e "${YELLOW}Already archived: $repo${NC}"
    fi
}

# Function to delete a repo (requires gh CLI)
delete_repo() {
    local repo=$1
    echo -e "${RED}Deleting: $GH_USER/$repo${NC}"

    read -p "Confirm deletion of $repo? (yes/no): " confirm
    if [ "$confirm" == "yes" ]; then
        gh repo delete "$GH_USER/$repo" --yes
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Deleted: $repo${NC}"
        else
            echo -e "${RED}✗ Failed to delete: $repo${NC}"
        fi
    else
        echo -e "${YELLOW}Skipped: $repo${NC}"
    fi
}

echo ""
echo "=========================================="
echo "PHASE 1: SAFE DELETIONS"
echo "=========================================="
echo ""

# Array of repos to delete in Phase 1 (URL pattern duplicates)
declare -a URL_DUPLICATES=(
    "https-github.com-absulysuly-letsdoittonight"
    "https-github.com-absulysuly-5daysleft-social"
    "https-github.com-absulysuly-DigitalDemocracy-Iraq-Clean"
    "https-github.com-absulysuly-GAME3D"
    "https-github.com-absulysuly-election-dashboard"
    "https-github.com-absulysuly-Dashboard-agernt"
    "https-github.com-absulysuly-phenoxagents"
    "https-github.com-absulysuly-rescue-mission-ai-studio"
    "https-github.com-absulysuly---SOCIALS"
)

echo "Deleting URL pattern duplicates..."
for repo in "${URL_DUPLICATES[@]}"; do
    archive_repo "$repo"
    delete_repo "$repo"
done

# Array of multi-copy repos
declare -a MULTI_COPIES=(
    "Copy-of-Copy-of-Copy-of-Copy-of-Eventara"
    "Copy-of-Copy-of-Copy-of-Eventara"
    "Copy-of-warp-eventra-copaypaste"
    "Copy-of-Hamlet-social-"
)

echo ""
echo "Deleting multi-copy repos..."
for repo in "${MULTI_COPIES[@]}"; do
    archive_repo "$repo"
    delete_repo "$repo"
done

# Array of deployment-only repos
declare -a DEPLOY_ONLY=(
    "Iraq-Events-Platformdeploy"
    "EVENT-DEPLOY"
    "kurdistan-event-deploy"
    "wedonetrepoo-deploy"
)

echo ""
echo "Deleting deployment-only repos..."
for repo in "${DEPLOY_ONLY[@]}"; do
    archive_repo "$repo"
    delete_repo "$repo"
done

# Array of broken/test repos
declare -a BROKEN_TEST=(
    "broken-eventra"
    "test-demo"
    "demo-ml-project"
    "my-app"
    "my-web-app"
)

echo ""
echo "Deleting broken/test repos..."
for repo in "${BROKEN_TEST[@]}"; do
    archive_repo "$repo"
    delete_repo "$repo"
done

# Array of typo variants
declare -a TYPOS=(
    "amlet-unified"
    "unifiedHmalet-complete2027"
    "Dashboard-agernt"
)

echo ""
echo "Deleting typo variants..."
for repo in "${TYPOS[@]}"; do
    archive_repo "$repo"
    delete_repo "$repo"
done

# Array of unclear/abandoned repos
declare -a ABANDONED=(
    "EMERGENCY-RESCUE-MISSION-LAST-MINIUTE-"
    "PAUL-THE-LEGEND"
    "MYCOFOUNDER-AGENT-ARMY"
    "raptor-halbjardn"
    "hussein"
    "New-apps"
    "config"
    "AI-QWAN-CAMPAIGN"
    "TBI-LOAD-AISTUDIO"
    "GAME3D"
    "letsdoittonight"
    "rescue-mission-ai-studio"
    "phenoxagents"
    "THREE-FINAL-EVENT-LAWYER-WEDO"
)

echo ""
echo "Deleting unclear/abandoned repos..."
for repo in "${ABANDONED[@]}"; do
    archive_repo "$repo"
    delete_repo "$repo"
done

echo ""
echo "=========================================="
echo "PHASE 1 COMPLETE"
echo "=========================================="
echo ""
echo -e "${GREEN}Backup location: $BACKUP_DIR${NC}"
echo ""
echo "Next steps:"
echo "1. Review MASTER_REPOSITORY_INVENTORY.md for Phase 2 deletions"
echo "2. Consolidate event platforms into 1 repo"
echo "3. Consolidate HAMLET variants"
echo "4. Consolidate WeDoneIt variants"
echo ""
echo "Run this script again for Phase 2 after updating the arrays."

exit 0
