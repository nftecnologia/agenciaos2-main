#!/bin/bash

echo "🚀 Deploy manual do worker para Railway..."

# Fazer backup dos arquivos originais
echo "📋 Fazendo backup das configurações..."
cp nixpacks.toml nixpacks.toml.backup
cp package.json package.json.backup

# Usar configurações específicas do worker
echo "⚙️ Aplicando configurações do worker..."
cp nixpacks.worker.toml nixpacks.toml
cp package.worker.json package.json

# Fazer commit temporário
echo "📝 Fazendo commit temporário..."
git add .
git commit -m "temp: worker configuration for deploy" --no-verify

# Deploy do worker
echo "🚀 Fazendo deploy..."
railway up --detach

# Restaurar arquivos originais
echo "🔄 Restaurando configurações originais..."
cp nixpacks.toml.backup nixpacks.toml
cp package.json.backup package.json

# Fazer commit final
git add .
git commit -m "restore: original configuration after worker deploy" --no-verify

echo "✅ Deploy do worker concluído!"
echo "🔗 Verifique em: https://railway.app/project/0ffce4ec-f5ce-4b83-aa1d-dc5d85fd7bc9"