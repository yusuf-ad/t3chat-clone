# 🚀 T3 Chat Clone

A modern, full-stack AI chat application built with Next.js 15, featuring support for multiple AI providers, real-time messaging, and a beautiful responsive UI.

![T3 Chat Clone](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🤖 AI Integration

- **Multiple AI Providers**: Support for OpenAI, Mistral, Anthropic (Claude), Google (Gemini), and OpenRouter
- **Model Selection**: Choose from GPT-4o, Claude 3.5 Sonnet, Gemini 2.0 Flash, Mistral Large, and more
- **Real-time Streaming**: Get responses as they're generated with streaming support
- **Custom API Keys**: Use your own API keys for cost optimization

### 💬 Chat Experience

- **Real-time Messaging**: Instant message delivery and responses
- **Chat History**: Persistent conversation storage with PostgreSQL
- **Message Formatting**: Full Markdown support with code syntax highlighting
- **Message Management**: Pin important chats, delete conversations
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### 🔐 Authentication & Security

- **Clerk Authentication**: Secure user management with Google OAuth
- **Session Management**: Persistent login sessions
- **User Profiles**: Customizable user settings and preferences

### 🎨 User Interface

- **Modern Design**: Clean, intuitive interface with shadcn/ui components
- **Dark/Light Mode**: Theme switching with system preference detection
- **Animations**: Smooth transitions and loading states
- **Accessibility**: WCAG compliant design

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Reliable relational database
- **Neon Database** - Serverless PostgreSQL hosting

### AI & Integration

- **Vercel AI SDK** - AI provider integration
- **OpenAI API** - GPT models
- **Anthropic API** - Claude models
- **Google AI API** - Gemini models
- **Mistral API** - Mistral models
- **OpenRouter** - Multiple model access

### Authentication

- **Clerk** - User authentication and management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- PostgreSQL database (or Neon account)
- Clerk account for authentication
- AI API keys (optional, for custom usage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/t3chat-clone.git
   cd t3chat-clone
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL=your_postgresql_connection_string

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth

   # AI API Keys (Optional - users can add their own)
   OPENAI_API_KEY=your_openai_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Basic Chat

1. Sign in with your Google account via Clerk
2. Select an AI model from the dropdown
3. Start typing your message
4. Press Enter or click Send to get AI responses

### Model Selection

- Choose from multiple AI providers and models
- Each model has different capabilities and pricing
- Premium models offer better performance

### API Keys

- Add your own API keys in Settings for cost optimization
- Supports OpenAI, OpenRouter, and other providers
- Keys are stored locally in your browser

### Chat Management

- View chat history in the sidebar
- Pin important conversations
- Delete conversations you no longer need

## 🏗 Project Structure

```
t3chat-clone/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── settings/         # Settings components
│   └── ...               # Feature components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── ai/              # AI provider configurations
│   └── ...              # Other utilities
├── server/               # Server-side code
│   ├── actions/         # Server actions
│   └── db/              # Database schema and config
└── styles/              # Global styles
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for the AI SDK and hosting platform
- [Shadcn](https://ui.shadcn.com) for the beautiful UI components
- [Clerk](https://clerk.com) for authentication services
- [Neon](https://neon.tech) for serverless PostgreSQL
- All the AI providers for their amazing APIs

## 🎯 Project Requirements

### Core Requirements (MVP)

#### 1. Chat Interface

- [x] Real-time chat interface with message history
- [x] Support for multiple AI models (e.g., GPT-4, Mistral)
- [x] Message streaming for real-time responses
- [x] Markdown support in messages
- [x] Code block formatting
- [x] Message status indicators (sending, sent, error)
- [ ] Message timestamps
- [x] User avatars and display names

#### 2. Authentication & User Management

- [x] User registration and login
- [x] OAuth integration (Google)
- [] User profile management
- [x] Session management

#### 3. Data Management

- [x] Chat history persistence
- [x] Real-time synchronization across devices
- [ ] Message search functionality
- [ ] Chat export/import
- [ ] Data backup system

#### 4. UI/UX Requirements

- [x] Responsive design (mobile, tablet, desktop)
- [x] Dark/Light mode
- [x] Loading states and animations
- [ ] Error handling and user feedback
- [ ] Keyboard shortcuts
- [ ] Accessibility compliance (WCAG 2.1)

### Bonus Features

#### 1. Advanced Chat Features

- [ ] Chat branching (create alternative conversation paths)
- [ ] Chat sharing with unique URLs
- [ ] Collaborative chat rooms
- [ ] Message reactions and replies
- [ ] Voice input/output (+++)
- [ ] Custom AI model fine-tuning

#### 2. File Handling

- [ ] File upload support (images, PDFs, documents)
- [ ] File preview
- [ ] Image generation with AI
- [ ] Document summarization
- [ ] OCR for image text extraction

#### 3. Advanced AI Features

- [ ] Web search integration
- [ ] Context-aware responses
- [ ] Multi-language support
- [ ] Custom AI model training
- [ ] AI-powered code completion
- [ ] AI-powered content summarization

#### 4. Developer Experience

- [ ] Syntax highlighting for code blocks
- [ ] Code execution environment
- [ ] API documentation
- [ ] Webhook support
- [ ] Rate limiting and usage tracking

#### 5. Performance & Security

- [ ] Resumable streams
- [ ] End-to-end encryption
- [ ] Rate limiting
- [ ] DDOS protection
- [ ] Performance monitoring
- [ ] Error tracking and logging

## 🛠 Technical Stack

### Frontend

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/ui
- vercel ai sdk

### Backend

- Next.js API Routes

### AI Integration

- OpenAI API
- Mistral API
- Openrouter API
