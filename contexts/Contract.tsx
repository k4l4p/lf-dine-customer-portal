// import { set_binder_tezos_toolkit } from '@completium/dapp-ts';
import constate from 'constate';
import { useState } from 'react';

// import { FIXME as Contract } from '../bindings/FIXME'; // replace FIXME
import { useContractAddress } from './Settings';
import { useTezosToolkit } from './Taquito';

export const [
  ContractProvider,
  useContract
] = constate(
  () => {
    const tezos = useTezosToolkit()
    const address = useContractAddress()
    const [contract] = useState({
      contract: tezos.wallet
      .at(address)
    });
    return contract;
  },
  (v) => v.contract
)