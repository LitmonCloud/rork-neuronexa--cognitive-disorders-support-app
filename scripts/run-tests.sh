#!/bin/bash

echo "🧪 NeuroNexa - Comprehensive Test Suite"
echo "========================================"
echo ""

echo "📋 Test Plan:"
echo "  1. Type checking"
echo "  2. Unit tests"
echo "  3. Integration tests"
echo "  4. Coverage report"
echo ""

FAILED=0

echo "🔍 Step 1: Type Checking..."
echo "----------------------------"
if npm run type-check; then
  echo "✅ Type checking passed"
else
  echo "❌ Type checking failed"
  FAILED=1
fi
echo ""

echo "🧪 Step 2: Running Unit Tests..."
echo "----------------------------"
if npm test -- --testPathPattern="__tests__/(services|utils)" --verbose; then
  echo "✅ Unit tests passed"
else
  echo "❌ Unit tests failed"
  FAILED=1
fi
echo ""

echo "🔗 Step 3: Running Integration Tests..."
echo "----------------------------"
if npm test -- --testPathPattern="__tests__/(contexts|components)" --verbose; then
  echo "✅ Integration tests passed"
else
  echo "❌ Integration tests failed"
  FAILED=1
fi
echo ""

echo "📊 Step 4: Generating Coverage Report..."
echo "----------------------------"
if npm run test:coverage; then
  echo "✅ Coverage report generated"
else
  echo "⚠️  Coverage report generation had issues"
fi
echo ""

echo "========================================"
if [ $FAILED -eq 0 ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Some tests failed. Please review the output above."
  exit 1
fi
