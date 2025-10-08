#!/usr/bin/env bash
set -euo pipefail

ISSUE_NUM=${1:-}
if [ -z "$ISSUE_NUM" ]; then
  echo "Usage: $0 <issue-number>"
  exit 2
fi

# Configuration
POLL_INTERVAL_SECONDS=${POLL_INTERVAL_SECONDS:-15}
TIMEOUT_MINUTES=${TIMEOUT_MINUTES:-45}

echo "📥 Auto-download watcher started for issue #$ISSUE_NUM"
echo "   Polling every ${POLL_INTERVAL_SECONDS}s, timeout ${TIMEOUT_MINUTES}m"

START_TS=$(date +%s)

while true; do
  # Try to download using the existing helper; it will succeed only when the
  # workflow has a completed run with the approved-test-file artifact.
  if ./scripts/download-approved-test.sh "$ISSUE_NUM" >/tmp/download-approved-$ISSUE_NUM.log 2>&1; then
    echo "✅ Approved test downloaded for issue #$ISSUE_NUM"
    echo "   See unapproved-tests/ for the file(s)."
    exit 0
  fi

  NOW_TS=$(date +%s)
  ELAPSED_MIN=$(( (NOW_TS - START_TS) / 60 ))
  if [ "$ELAPSED_MIN" -ge "$TIMEOUT_MINUTES" ]; then
    echo "⏱️  Timeout reached waiting for approved test for issue #$ISSUE_NUM"
    echo "    Last downloader output:"
    tail -n 50 "/tmp/download-approved-$ISSUE_NUM.log" || true
    exit 1
  fi

  sleep "$POLL_INTERVAL_SECONDS"
done


