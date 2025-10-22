#!/bin/bash

# MicroPropiedad BTC - Setup Verification Script
# This script verifies that all fixes have been applied correctly

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     MicroPropiedad BTC - Setup Verification               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PASS=0
FAIL=0

check() {
    if [ $? -eq 0 ]; then
        echo "  ✅ $1"
        ((PASS++))
    else
        echo "  ❌ $1"
        ((FAIL++))
    fi
}

# Check Node.js
echo "🔍 Checking prerequisites..."
node --version > /dev/null 2>&1
check "Node.js installed"

npm --version > /dev/null 2>&1
check "npm installed"

clarinet --version > /dev/null 2>&1
check "Clarinet installed"

echo ""
echo "📁 Checking project structure..."

# Check directories
[ -d "contracts" ]
check "contracts/ directory exists"

[ -d "frontend" ]
check "frontend/ directory exists"

[ -d "backend" ]
check "backend/ directory exists"

# Check key files
[ -f "package.json" ]
check "Root package.json exists"

[ -f "frontend/package.json" ]
check "Frontend package.json exists"

[ -f "backend/package.json" ]
check "Backend package.json exists"

[ -f "contracts/package.json" ]
check "Contracts package.json exists"

echo ""
echo "📋 Checking contract files..."

[ -f "contracts/contracts/property-factory.clar" ]
check "property-factory.clar exists"

[ -f "contracts/contracts/property.clar" ]
check "property.clar exists"

[ -f "contracts/contracts/sip010-ft-trait.clar" ]
check "sip010-ft-trait.clar exists"

echo ""
echo "📝 Checking test files..."

[ -f "contracts/tests/property-factory.test.ts" ]
check "property-factory.test.ts exists"

[ -f "contracts/tests/property.test.ts" ]
check "property.test.ts exists"

echo ""
echo "🎨 Checking frontend fixes..."

# Check if language selector is in Navbar
grep -q "EN | ES" frontend/components/layout/Navbar.tsx 2>/dev/null
if [ $? -eq 0 ]; then
    check "Language selector added to Navbar"
else
    grep -q "EN.*ES" frontend/components/layout/Navbar.tsx 2>/dev/null
    check "Language selector added to Navbar"
fi

# Check if wallet connect is fixed
grep -q "onClick={connect}" frontend/components/layout/Navbar.tsx 2>/dev/null
check "Wallet connect button fixed"

# Check z-index fix
grep -q "z-\[9999\]" frontend/components/layout/Navbar.tsx 2>/dev/null
check "Dropdown z-index fixed"

# Check marketplace content
grep -q "Invest in Real Estate" frontend/app/\[locale\]/marketplace/page.tsx 2>/dev/null
check "Marketplace hero text updated"

grep -q "Residential.*Commercial" frontend/app/\[locale\]/marketplace/page.tsx 2>/dev/null
check "Property categories updated"

echo ""
echo "🔌 Checking backend files..."

[ -f "backend/src/index.js" ]
check "Backend API server exists"

[ -f "backend/src/oracle/index.js" ]
check "Oracle service exists"

[ -f "backend/.env.example" ]
check "Backend .env.example exists"

echo ""
echo "📚 Checking documentation..."

[ -f "QUICK_START.md" ]
check "QUICK_START.md exists"

[ -f "DEPLOYMENT_GUIDE.md" ]
check "DEPLOYMENT_GUIDE.md exists"

[ -f "FIXES_SUMMARY.md" ]
check "FIXES_SUMMARY.md exists"

[ -f "backend/README.md" ]
check "Backend README.md exists"

echo ""
echo "⚙️  Checking configuration files..."

[ -f "frontend/.env.example" ]
check "Frontend .env.example exists"

[ -f "backend/.env.example" ]
check "Backend .env.example exists"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "   Results: $PASS passed, $FAIL failed"
echo "════════════════════════════════════════════════════════════"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All checks passed! Setup is complete."
    echo ""
    echo "Next steps:"
    echo "  1. Run: npm run install:all"
    echo "  2. Run: npm run test:contracts"
    echo "  3. Run: npm run dev:frontend"
    echo ""
    exit 0
else
    echo "⚠️  Some checks failed. Please review the output above."
    echo ""
    exit 1
fi
