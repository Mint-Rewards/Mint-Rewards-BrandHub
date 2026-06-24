#!/bin/bash
# Ralph Wiggum — spec queue helpers for bash

# A spec is COMPLETE if it contains a line matching: Status: COMPLETE
_is_spec_complete() {
    local file="$1"
    grep -qE "^(\*\*Status\*\*|Status|## Status): COMPLETE" "$file" 2>/dev/null
}

# List all .md files in the given specs directory, sorted
get_root_specs() {
    local dir="${1:-specs}"
    find "$dir" -maxdepth 1 -name "*.md" | sort
}

# Return 0 (true) if spec file is complete
is_root_spec_complete() {
    local file="$1"
    _is_spec_complete "$file"
}

# Print paths of incomplete spec files
get_incomplete_root_specs() {
    local dir="${1:-specs}"
    while IFS= read -r f; do
        if ! _is_spec_complete "$f"; then
            echo "$f"
        fi
    done < <(get_root_specs "$dir")
}

# Count total spec files
count_root_specs() {
    local dir="${1:-specs}"
    get_root_specs "$dir" | wc -l | tr -d ' '
}

# Count incomplete spec files
count_incomplete_root_specs() {
    local dir="${1:-specs}"
    get_incomplete_root_specs "$dir" | wc -l | tr -d ' '
}

# Print the path of the first (highest-priority) incomplete spec
get_first_incomplete_root_spec() {
    local dir="${1:-specs}"
    get_incomplete_root_specs "$dir" | head -n 1
}
