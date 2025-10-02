#!/bin/bash

echo "🔍 NeuroNexa TypeScript Type Checking"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Running TypeScript compiler in check mode..."
echo ""

npx tsc --noEmit

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ No TypeScript errors found!"
  echo ""
  exit 0
else
  echo ""
  echo "❌ TypeScript errors detected. Please fix the errors above."
  echo ""
  exit 1
fi
