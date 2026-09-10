#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    *) echo "usage: $0 [--force]" >&2; exit 2 ;;
  esac
done

mkdir -p "$CLAUDE_DIR/skills" "$CLAUDE_DIR/agents"

skipped=0

link() {
  local source="$1" target="$2" kind="$3" name="$4"
  if [ -e "$target" ] && [ ! -L "$target" ]; then
    if [ "$FORCE" -eq 0 ]; then
      echo "skipped $kind: $name (not a symlink, would delete $target; rerun with --force to replace)" >&2
      skipped=$((skipped + 1))
      return
    fi
    echo "replacing $kind: $name (--force over $target)" >&2
  fi
  rm -rf "$target"
  ln -s "$source" "$target"
  echo "linked $kind: $name"
}

for skill_dir in "$REPO_DIR"/skills/*/; do
  skill_dir="${skill_dir%/}"
  name="$(basename "$skill_dir")"
  [ -f "$skill_dir/SKILL.md" ] || continue
  link "$skill_dir" "$CLAUDE_DIR/skills/$name" skill "$name"
done

for agent_file in "$REPO_DIR"/agents/*.md; do
  name="$(basename "$agent_file")"
  link "$agent_file" "$CLAUDE_DIR/agents/$name" agent "$name"
done

if [ "$skipped" -gt 0 ]; then
  echo "$skipped item(s) skipped to avoid deleting files this repo does not own" >&2
  exit 1
fi
