import {
  Blockchain,
  ChainIds,
  DidMethod,
  DidMethodByte,
  DidMethodNetwork,
  NetworkId
} from './constants';
import { DID } from './did';

const registerDidMethodWithByte = (method: string, byte: number): void => {
  DidMethod[method] = method;

  if (typeof DidMethodByte[method] === 'number') {
    throw new Error(`did method ${method} already registered`);
  }

  DidMethodByte[method] = byte;
};

/**
 * Register chain ID for a blockchain and network.
 *
 * @param {string} blockchain
 * @param {string} network
 * @param {number} [chainId]
 * @returns {void}
 */
export const registerChainId = (blockchain: string, network: string, chainId: number): void => {
  const key = `${blockchain}:${network}`;

  if (typeof ChainIds[key] === 'number') {
    throw new Error(`chainId ${blockchain}:${network} already registered`);
  }

  ChainIds[key] = chainId;
};

/**
 * Get chain ID by a blockchain and network.
 *
 * @param {string} blockchain
 * @param {string} [network]
 * @returns {number}
 */
export const getChainId = (blockchain: string, network?: string): number => {
  if (network) {
    blockchain += `:${network}`;
  }
  const chainId = ChainIds[blockchain];
  if (!chainId) {
    throw new Error(`chainId not found for ${blockchain}`);
  }
  return chainId;
};

/**
 * ChainIDfromDID returns chain name from w3c.DID
 *
 * @param {DID} did
 * @returns {number}
 */
export const chainIDfromDID = (did: DID): number => {
  const id = DID.idFromDID(did);

  const blockchain = DID.blockchainFromId(id);

  const networkId = DID.networkIdFromId(id);

  const chainId = ChainIds[`${blockchain}:${networkId}`];
  if (typeof chainId !== 'number') {
    throw new Error(`chainId not found for ${blockchain}:${networkId}`);
  }

  return chainId;
};

/**
 * Register a DID method with a byte value.
 * https://docs.iden3.io/getting-started/identity/identity-types/#regular-identity
 * @param {{
 *   method: DidMethodName;  DID method name
 *   methodByte?: number; put DID method byte value in case you want to register new DID method
 *   blockchain: BlockchainName;  blockchain name
 *   network: NetworkName;  network name
 *   networkFlag: number;  network flag
 *   chainId?: number;  put  chain ID in case you need to use it
 * }} {
 *   method,
 *   methodByte,
 *   blockchain,
 *   network,
 *   chainId,
 *   networkFlag
 * }
 */
export const registerDidMethodNetwork = ({
  method,
  methodByte,
  blockchain,
  network,
  chainId,
  networkFlag
}: {
  method: string;
  methodByte?: number;
  blockchain: string;
  network: string;
  networkFlag: number;
  chainId?: number;
}): void => {
  Blockchain[blockchain] = blockchain;
  NetworkId[network] = network;
  if (typeof methodByte === 'number') {
    registerDidMethodWithByte(method, methodByte);
  }

  if (!DidMethodNetwork[method]) {
    DidMethodNetwork[method] = {};
  }

  if (typeof chainId === 'number') {
    registerChainId(blockchain, network, chainId);
  }

  const key = `${blockchain}:${network}`;
  if (typeof DidMethodNetwork[method][key] === 'number') {
    throw new Error(`did method network ${key} already registered`);
  }
  DidMethodNetwork[method][key] = networkFlag;
};
