# 🤖 Johbry Virtual Assistant

> An intelligent virtual assistant powered by Google Gemini, built with Next.js, TypeScript, and AWS S3 for configuration management.

## 📖 Documentation

**All documentation is consolidated in [`DOCUMENTATION.md`](./DOCUMENTATION.md)**

That file contains:
- ✅ Complete setup and configuration guide
- ✅ Architecture overview
- ✅ Development workflows
- ✅ Production deployment steps
- ✅ AWS S3 integration
- ✅ Logging and debugging
- ✅ Troubleshooting guide
- ✅ Security best practices

## ⚡ Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

See the [Deployment section](./DOCUMENTATION.md#-despliegue-a-producción) in DOCUMENTATION.md

## 🏗️ Tech Stack

- **Frontend**: React 19.2.4 + Next.js 16.2.6
- **Backend**: Node.js + TypeScript
- **LLM**: Google Gemini 2.5-flash
- **Config Storage**: AWS S3
- **Config Format**: YAML

## 📁 Project Structure

```
johbry-virtual-assistant/
├── src/
│   ├── backend/
│   │   ├── domain/          # Domain models
│   │   ├── application/     # Use cases
│   │   └── infra/          # Infrastructure (S3, repositories)
│   ├── config/
│   │   └── prompts/        # YAML configuration files
│   └── app/                # Next.js app directory
├── DOCUMENTATION.md        # Complete documentation
├── package.json
└── tsconfig.json
```

## 🚀 Key Features

- ✅ Configurable prompts via YAML
- ✅ Local development with file-based config
- ✅ S3-based configuration for production
- ✅ Automatic environment-based repository selection
- ✅ TypeScript with strict type checking
- ✅ Clean Architecture pattern
- ✅ Comprehensive error handling and logging

## 📋 Available Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript type checking
```

## 🔧 Configuration

All configuration is managed through:
- **Development**: `src/config/prompts/config.yaml` (local file)
- **Production**: AWS S3 bucket (`s3://[BUCKET_NAME]/prompts/config.yaml`)

See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed setup instructions.

## 📝 License

Proprietary - All rights reserved.

---

**For complete documentation, see [`DOCUMENTATION.md`](./DOCUMENTATION.md)**
