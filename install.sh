#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"

mkdir -p "$CLAUDE_DIR/skills" "$CLAUDE_DIR/agents"

for skill_dir in "$REPO_DIR"/skills/*/; do
  skill_dir="${skill_dir%/}"
  name="$(basename "$skill_dir")"
  [ -f "$skill_dir/SKILL.md" ] || continue
  target="$CLAUDE_DIR/skills/$name"
  rm -rf "$target"
  ln -s "$skill_dir" "$target"
  echo "linked skill: $name"
done

for agent_file in "$REPO_DIR"/agents/*.md; do
  name="$(basename "$agent_file")"
  target="$CLAUDE_DIR/agents/$name"
  rm -rf "$target"
  ln -s "$agent_file" "$target"
  echo "linked agent: $name"
done
