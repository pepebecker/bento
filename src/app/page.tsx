import { cookies } from 'next/headers';
import { Layouts } from 'react-grid-layout';
import { LayoutProvider } from '@/components/LayoutProvider';
import Toolbar from '@/components/Toolbar';
import { getFirebaseAdmin } from '@/server/firebase';
import { Boxes } from '@/types/box';
import GridLayout from '../components/GridLayout';

export default async function Page() {
  const user = await getAuthUser();
  const [boxes, layouts] = await Promise.all([
    loadBoxes(user?.uid),
    loadLayouts(user?.uid),
  ]);
  return (
    <div className="h-svh w-svw min-w-[300px] overflow-y-scroll">
      <LayoutProvider boxes={boxes} layouts={layouts}>
        <GridLayout />
        <Toolbar />
      </LayoutProvider>
    </div>
  );
}

async function getAuthUser() {
  const __session = (await cookies()).get('__session')?.value;
  if (!__session) return;
  return getFirebaseAdmin()?.auth().verifySessionCookie(__session);
}

function getUserURL(uid?: string) {
  return `${process.env.FIREBASE_ADMIN_DATABASE_URL}/users/${uid ?? process.env.PUBLIC_PROFILE_ID}`;
}

async function loadLayouts(uid?: string): Promise<Layouts | undefined> {
  const res = await fetch(`${getUserURL(uid)}/layouts.json`, {
    cache: 'no-store',
  });
  return res.json();
}

async function loadBoxes(uid?: string): Promise<Boxes | undefined> {
  const res = await fetch(`${getUserURL(uid)}/boxes.json`, {
    cache: 'no-store',
  });
  const data = await res.json();
  if (!Array.isArray(data)) return data;
  return data.reduce((acc, val) => {
    if (!val?.id) return acc;
    return { ...acc, [val.id]: val };
  }, {});
}
