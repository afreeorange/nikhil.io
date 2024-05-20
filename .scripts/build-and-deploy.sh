#!/usr/bin/env bash

# This is for local deployments

set -euo pipefail

echo "Building"
echo "------------------------------------------------------------------------"
pnpm build

echo "Compressing output"
echo "------------------------------------------------------------------------"
find dist/ -type f -exec gzip -9 "{}" \; -exec mv "{}.gz" "{}" \;

echo "Syncing"
echo "------------------------------------------------------------------------"
aws s3 sync dist/ s3://nikhil.io/ --delete \
  --cache-control max-age=315360000 \
  --content-encoding gzip \
  --profile nikhil.io

echo "Invalidating"
echo "------------------------------------------------------------------------"
aws cloudfront create-invalidation \
  --distribution-id E1YXRY7X6OHL2S \
  --paths '/*' \
  --profile nikhil.io
