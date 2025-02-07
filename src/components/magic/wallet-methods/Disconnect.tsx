import React, { useCallback, useState } from 'react';

import { useMagic } from '../../../providers/MagicProvider';
import Spinner from '@/components/ui/Spinner';

const Disconnect = () => {
  const { magic, onLogout } = useMagic();
  const [disabled, setDisabled] = useState(false);

  const disconnect = useCallback(async () => {
    if (!magic) return;
    try {
      setDisabled(true);
      await onLogout();
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [onLogout]);

  return (
    <div className="wallet-method-container">
      <button className="wallet-method" onClick={disconnect} disabled={disabled}>
        {disabled ? (
          <div className="w-[115px] loading-container">
            <Spinner />
          </div>
        ) : (
          'disconnect()'
        )}
      </button>
      <div className="wallet-method-desc">Disconnects user from dApp.</div>
    </div>
  );
};

export default Disconnect;
