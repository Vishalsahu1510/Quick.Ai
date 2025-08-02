# QuickAI – Full Stack AI SaaS App

[Live](https://quick.ai)

Easily create, analyze, and manage AI-generated content with QuickAI, an open-source AI-powered SaaS platform built using the PERN Stack (PostgreSQL, Express, React, Node.js).  
Deployed on Vercel.

## Features

- **User Authentication**: Secure sign-in, sign-up, and profile management via Clerk.
- **Subscription Billing**: Premium plans unlocked via Clerk payments.
- **PostgreSQL Database**: Fast, serverless storage using Neon.
- **Multiple AI Tools**:
  - Article Generator: Create long or short AI-written articles.
  - Blog Title Generator: Get blog titles by keyword and category.
  - Image Generator: Generate AI images from prompts (premium).
  - Background Remover: Instantly remove backgrounds from uploaded images.
  - Object Remover: Remove specified objects from an image.
  - Resume Analyzer: Upload a resume & receive feedback and suggestions.
- **Community Gallery**: View and like public images shared by users.
- **Responsive Design**: Modern, mobile-friendly UI inspired by Figma design.

## Tech Stack

| Frontend        | Backend     | Database    | Auth & Billing | Deployment |
|-----------------|------------|-------------|----------------|------------|
| React (Vite)    | Node.js    | PostgreSQL  | Clerk  | Vercel     |
| Tailwind CSS    | Express.js | Neon        |                |            |

## Getting Started

### 1. Clone the Repository

```bash
git clone 
cd QuickAI
```

### 2. Project Structure

```
QuickAI/
  ├── client/    # React frontend
  └── server/    # Node.js/Express backend
```

### 3. Install Dependencies

- **Frontend:**
  ```bash
  cd client
  npm install
  ```
- **Backend:**
  ```bash
  cd ../server
  npm install
  ```

### 4. Environment Variables

Create `.env` files in both the `client` and `server` folders based on the provided `.env.example` or guidelines in the documentation.  
You’ll need:
- Clerk publishable key
- Neon database URL
- Any other service credentials

### 5. Run Locally

- **Frontend:**
  ```bash
  npm run dev
  ```
- **Backend:**
  ```bash
  npm run dev
  ```

### 6. Deploy



## Screenshots
<!-- <img width="1920" height="1080" alt="Screenshot (740)" src="https://github.com/user-attachments/assets/4cece942-76da-4d0b-a54b-1b3a8063aa4b" />

<img width="1920" height="1080" alt="Screenshot (741)" src="https://github.com/user-attachments/assets/2bb803e3-4836-4135-ba9b-053b1490cfde" />

<img width="1920" height="1080" alt="Screenshot (746)" src="https://github.com/user-attachments/assets/84d4ae38-b457-4229-8d26-db3d2d171615" />

<img width="1920" height="1080" alt="Screenshot (749)" src="https://github.com/user-attachments/assets/82e5caeb-e21c-481c-bcf4-d802ac695fb8" />

<img width="1920" height="1080" alt="Screenshot (751)" src="https://github.com/user-attachments/assets/b710f8f7-3c30-4eaf-9e15-a562d8ca10ba" /> -->



## Useful Links

- [Demo App](https://)
- [Neon Database](https://neon.tech/)
- [Clerk Authentication](https://clerk.com/)
- [Clipdrop APIs](https://clipdrop.co/apis/docs/text-to-image)
- [Vercel](https://vercel.com/)

## Contact

For questions or feedback, mail at vishalsahu0644@gmail.com