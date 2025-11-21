#!/bin/bash

echo "🚀 TinyLink Quick Start"
echo "======================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your database URL before continuing"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if Prisma client is generated
echo "🔧 Generating Prisma client..."
npx prisma generate

# Ask about database setup
echo ""
echo "🗄️  Database Setup"
echo "=================="
echo ""
echo "Do you want to initialize the database now?"
echo "1) Yes - I have a PostgreSQL database ready"
echo "2) No - I'll set it up later"
echo ""
read -p "Choose (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "🔄 Running database migrations..."
    npx prisma migrate dev --name init
    
    if [ $? -eq 0 ]; then
        echo "✅ Database initialized successfully!"
    else
        echo "❌ Database initialization failed. Please check your DATABASE_URL in .env"
        exit 1
    fi
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Ensure your DATABASE_URL in .env is correct"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "📖 For deployment instructions, see SETUP.md"
echo ""
