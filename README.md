# User Authentication Demo

This is a [Next.js](https://nextjs.org) project with comprehensive authentication and an **AI-powered test generation system** designed for aviation industry compliance.

## 🤖 NEW: AI Test Generation System

This project now includes a complete AI test generation workflow where AI can **only generate tests, never application code**.

### Quick Links
- 📖 **[User Guide](tests/AI_TEST_WORKFLOW.md)** - How to generate tests with AI
- ✅ **[Review Checklist](tests/REVIEW_CHECKLIST.md)** - Guidelines for reviewing AI tests
- 🚀 **[Setup Guide](SETUP_GUIDE.md)** - Complete setup instructions
- 📋 **[Quick Reference](README_AI_TEST_WORKFLOW.md)** - One-page overview
- 📊 **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Technical details

### Generate Your First Test

```
@claude start test workflow

File: src/lib/your-file.ts
Method: yourMethodName
Framework: Vitest
Test Type: Unit test

[paste method code here]
```

**Result:** Automated test generation → execution → PR creation in 5-10 minutes

### Safety & Compliance
- ✅ **Path guards** prevent AI from modifying application code
- ✅ **Human review** required for all generated tests
- ✅ **Complete audit trail** for compliance
- ✅ **Test gating** ensures quality

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
