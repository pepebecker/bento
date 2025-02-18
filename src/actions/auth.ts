'use server';

import { cookies } from 'next/headers';
import { getFirebaseAdmin } from '@/server/firebase';

export async function serverSignIn(idToken: string) {
  const cookie = await getFirebaseAdmin()
    ?.auth()
    .createSessionCookie(idToken, { expiresIn: 1000 * 60 * 24 * 7 });
  if (!cookie) return;
  (await cookies()).set('__session', cookie);
}

export async function serverSignOut() {
  (await cookies()).delete('__session');
}
