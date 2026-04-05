FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YnJpZ2h0LXBhbmRhLTkzLmNsZXJrLmFjY291bnRzLmRldiQ
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
ENV NEXT_PUBLIC_SUPABASE_URL=https://smb-db.cognabase.com
ENV NEXT_PUBLIC_APP_URL=https://smbchat.alwaysencrypted.com

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YnJpZ2h0LXBhbmRhLTkzLmNsZXJrLmFjY291bnRzLmRldiQ
ENV CLERK_SECRET_KEY=sk_test_9zh1t9sRSJ5y7UdXmCBfginSMJNGVgZ1OrwAncO5kL
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
ENV NEXT_PUBLIC_SUPABASE_URL=https://smb-db.cognabase.com
ENV SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2Njk0Mzg0MCwiZXhwIjo0OTIyNjE3NDQwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.Ywa_8b8n6oWbNNzRBfbdF5Zqg7PADjrmN9HFuT-Okyo
ENV NEXT_PUBLIC_APP_URL=https://smbchat.alwaysencrypted.com

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
