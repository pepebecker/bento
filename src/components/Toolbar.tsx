'use client';

import { ComponentProps, useCallback, useEffect } from 'react';
import {
  CaretDown,
  CaretUp,
  Eye,
  Image,
  Link,
  MarkdownLogo,
  PencilSimple,
  Selection,
  SignOut,
  TextH,
  TextT,
  User,
} from '@phosphor-icons/react';
import { signOut as fbSigbOut, getIdToken } from 'firebase/auth';
import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { serverSignIn, serverSignOut } from '@/actions/auth';
import { auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { useLayout } from './LayoutProvider';
import { Button } from './ui/button';

/* eslint-disable jsx-a11y/alt-text */

async function signOut() {
  await serverSignOut();
  await fbSigbOut(auth);
}

export default function Toolbar() {
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [user, , error] = useAuthState(auth);

  const signIn = useCallback(async () => {
    const credential = await signInWithGoogle();
    if (!credential) return;
    const idToken = await getIdToken(credential.user);
    await serverSignIn(idToken);
  }, [signInWithGoogle]);

  useEffect(() => {
    if (!error) return;
    console.error(error?.message ?? error);
  }, [error]);

  const { toolbarOpen, editing, setToolbarOpen, setEditing, addBox } =
    useLayout();

  return (
    <div
      className={cn(
        'absolute bottom-0 left-1/2 z-50 flex -translate-x-1/2 gap-2 overflow-hidden rounded-lg border bg-background bg-opacity-30 backdrop-blur transition-all',
        {
          'p-2': toolbarOpen,
          '-translate-y-20': toolbarOpen,
          'h-7 rounded-b-none border-b-0 hover:h-9': !toolbarOpen,
        }
      )}
    >
      {toolbarOpen ? (
        <>
          <ToolbarButton variant="default" onClick={() => setEditing(!editing)}>
            {editing ? (
              <Eye size={32} weight="bold" />
            ) : (
              <PencilSimple size={32} weight="bold" />
            )}
          </ToolbarButton>
          <ToolbarButton hidden={!editing} onClick={() => addBox('text')}>
            <TextT size={32} weight="bold" />
          </ToolbarButton>
          <ToolbarButton hidden={!editing} onClick={() => addBox('markdown')}>
            <MarkdownLogo size={32} weight="bold" />
          </ToolbarButton>
          <ToolbarButton hidden={!editing} onClick={() => addBox('heading')}>
            <TextH size={32} weight="bold" />
          </ToolbarButton>
          <ToolbarButton hidden={!editing} onClick={() => addBox('link')}>
            <Link size={32} weight="bold" />
          </ToolbarButton>
          <ToolbarButton hidden={!editing} onClick={() => addBox('image')}>
            <Image size={32} weight="bold" />
          </ToolbarButton>
          <ToolbarButton hidden={!editing} onClick={() => addBox('iframe')}>
            <Selection size={32} weight="bold" />
          </ToolbarButton>
          <ToolbarButton onClick={() => setToolbarOpen(false)}>
            <CaretDown size={32} weight="bold" />
          </ToolbarButton>
          {user ? (
            <ToolbarButton variant="destructive" onClick={signOut}>
              <SignOut size={32} />
            </ToolbarButton>
          ) : (
            <ToolbarButton onClick={signIn}>
              <User size={32} weight="bold" />
            </ToolbarButton>
          )}
        </>
      ) : (
        <Button
          className="rounded-none border-0 bg-transparent pb-2"
          variant="outline"
          size="icon"
          onClick={() => setToolbarOpen(true)}
        >
          <CaretUp size={32} weight="bold" />
        </Button>
      )}
    </div>
  );
}

interface ButtonProps extends ComponentProps<typeof Button> {
  hidden?: boolean;
}

function ToolbarButton(props: ButtonProps) {
  return (
    <Button
      size="icon"
      variant="outline"
      {...props}
      className={cn(
        'transition-all',
        {
          '-ml-2 w-0 overflow-hidden border-0 p-0 opacity-0': props.hidden,
        },
        props.className
      )}
    />
  );
}
