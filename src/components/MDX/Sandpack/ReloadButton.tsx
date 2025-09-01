/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconRestart} from '../../Icon/IconRestart';
export interface ReloadButtonProps {
  onReload: () => void;
}

export function ReloadButton({onReload}: ReloadButtonProps) {
  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
<<<<<<< HEAD:src/components/MDX/Sandpack/ResetButton.tsx
      onClick={onReset}
      title="Reiniciar Sandbox"
      type="button">
      <IconRestart className="inline mx-1 relative" /> Reiniciar
=======
      onClick={onReload}
      title="Keep your edits and reload sandbox"
      type="button">
      <IconRestart className="inline mx-1 relative" />
      <span className="hidden md:block">Reload</span>
>>>>>>> 2774ddfa0c39b8c2f0563b987dcb90a01ee723cf:src/components/MDX/Sandpack/ReloadButton.tsx
    </button>
  );
}
