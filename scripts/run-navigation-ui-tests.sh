#!/bin/bash

echo "🧪 Running Navigation and UI Tests..."
echo "======================================"
echo ""

echo "📱 Running Navigation Tests..."
bun test __tests__/navigation/ --verbose

echo ""
echo "🎨 Running UI Tests..."
bun test __tests__/ui/ --verbose

echo ""
echo "✅ Navigation and UI Tests Complete!"
