#!/usr/bin/env bash

# This is for local deployments

set -euo pipefail

pnpm run clean
parcel build
cp src/assets/robots.txt dist/

