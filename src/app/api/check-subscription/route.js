// src/app/api/check-subscription/route.js
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function GET(req) {
  // 1) Identify the user
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ isPro: false });
  }

  // 2) Fetch Clerk user to inspect metadata
  const user = await clerkClient.users.getUser(userId);

  // 3) Admin bypass: if publicMetadata.role === "admin", grant full access
  if (user.publicMetadata?.role === 'admin') {
    return NextResponse.json({ isPro: true });
  }

  // 4) Otherwise, fall back to Stripe subscription check
  const customerId = user.externalAccounts
    ?.find(acc => acc.provider === 'stripe')
    ?.externalAccountId;

  if (!customerId) {
    return NextResponse.json({ isPro: false });
  }

  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  return NextResponse.json({ isPro: subs.data.length > 0 });
}