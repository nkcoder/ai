#!/usr/bin/env bash
# Installs every skill listed in manifest.txt into ~/.claude/skills/<skill-name>/.
# GitHub Copilot CLI reads skills from that same directory, so this covers both.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$SCRIPT_DIR/manifest.txt"
SKILLS_DIR="$HOME/.claude/skills"

FORCE=0

usage() {
  cat <<EOF
Usage: $(basename "$0") [--force]

  --force    overwrite skills that are already installed (default: skip them)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

mkdir -p "$SKILLS_DIR"

# Installs one directory containing a SKILL.md into SKILLS_DIR, under the
# name declared in that SKILL.md's frontmatter (falls back to the
# directory's own name if none is found).
install_skill_dir() {
  local src="$1" as_symlink="$2"
  local name
  name=$(sed -n 's/^name:[[:space:]]*//p' "$src/SKILL.md" | head -1 | tr -d '"' | xargs)
  [[ -z "$name" ]] && name="$(basename "$src")"

  local dest="$SKILLS_DIR/$name"
  if [[ -e "$dest" || -L "$dest" ]]; then
    if [[ "$FORCE" -eq 1 ]]; then
      rm -rf "$dest"
    else
      echo "  skip $name -> $dest (already installed, use --force to update)"
      return
    fi
  fi
  if [[ "$as_symlink" -eq 1 ]]; then
    ln -s "$src" "$dest"
  else
    cp -R "$src" "$dest"
  fi
  echo "  installed $name -> $dest"
}

install_local() {
  local id="$1" path="$2"
  local src="$REPO_ROOT/$path"
  if [[ ! -f "$src/SKILL.md" ]]; then
    echo "  ! $id: no SKILL.md at $src, skipping" >&2
    return
  fi
  install_skill_dir "$src" 1
}

install_github() {
  local id="$1" repo="$2" ref="$3" path="$4"
  local tmp
  tmp=$(mktemp -d)
  echo "  fetching $repo${ref:+ @$ref} ($path)..."

  local clone_args=(--depth 1 --filter=blob:none --quiet)
  [[ -n "$ref" && "$ref" != "-" ]] && clone_args+=(-b "$ref")

  if [[ "$path" == "." ]]; then
    git clone "${clone_args[@]}" "https://github.com/$repo.git" "$tmp"
  else
    git clone --sparse "${clone_args[@]}" "https://github.com/$repo.git" "$tmp"
    (cd "$tmp" && git sparse-checkout set "$path")
  fi

  local found=0 skill_md
  while IFS= read -r skill_md; do
    found=1
    install_skill_dir "$(dirname "$skill_md")" 0
  done < <(find "$tmp/$path" -iname "SKILL.md" 2>/dev/null)

  [[ "$found" -eq 0 ]] && echo "  ! $id: no SKILL.md found under $path" >&2
  rm -rf "$tmp"
}

echo "Target directory: $SKILLS_DIR"
echo

while IFS='|' read -r id kind repo ref path; do
  [[ -z "$id" || "$id" == \#* ]] && continue
  echo "== $id =="
  if [[ "$kind" == "local" ]]; then
    install_local "$id" "$path"
  else
    install_github "$id" "$repo" "$ref" "$path"
  fi
done < "$MANIFEST"
