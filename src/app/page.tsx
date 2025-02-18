import { Layouts } from 'react-grid-layout';
import { LayoutProvider } from '@/components/LayoutProvider';
import Toolbar from '@/components/Toolbar';
import { Boxes } from '@/types/box';
import GridLayout from '../components/GridLayout';

export default async function Page() {
  const [boxes, layouts] = await Promise.all([loadBoxes(), loadLayouts()]);
  return (
    <div className="h-svh w-svw min-w-[300px] overflow-y-scroll">
      <LayoutProvider boxes={boxes} layouts={layouts}>
        <GridLayout />
        <Toolbar />
      </LayoutProvider>
    </div>
  );
}

async function loadLayouts(): Promise<Layouts | undefined> {
  const res = await fetch(
    'https://pepe-becker-default-rtdb.firebaseio.com/users/wMr1Zy0fDrhcNlAGGfdTM8yYyHQ2/layouts.json',
    { cache: 'no-store' }
  );
  const data = await res.json();
  return data;
}

async function loadBoxes(): Promise<Boxes | undefined> {
  const res = await fetch(
    'https://pepe-becker-default-rtdb.firebaseio.com/users/wMr1Zy0fDrhcNlAGGfdTM8yYyHQ2/boxes.json',
    { cache: 'no-store' }
  );
  const data = await res.json();
  if (!Array.isArray(data)) return data;
  return data.reduce((acc, val) => {
    if (!val?.id) return acc;
    return { ...acc, [val.id]: val };
  }, {});
}
