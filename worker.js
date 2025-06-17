#!/usr/bin/env node

// Worker de produção que usa ts-node para executar o TypeScript
require('ts-node/register')
require('./worker.ts')