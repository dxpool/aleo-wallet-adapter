import {
    BaseMessageSignerWalletAdapter,
    EventEmitter,
    scopePollingDetectionStrategy,
    WalletConnectionError,
    WalletDisconnectionError,
    WalletName,
    WalletNotConnectedError,
    WalletNotReadyError,
    WalletReadyState,
    WalletSignTransactionError,
    WalletDecryptionNotAllowedError,
    WalletDecryptionError,
    WalletRecordsError,
    DecryptPermission,
    WalletAdapterNetwork,
    AleoTransaction,
    AleoDeployment,
    WalletTransactionError,
} from '@demox-labs/aleo-wallet-adapter-base';

export interface FxWalletEvents {
    connect(...args: unknown[]): unknown;
    disconnect(...args: unknown[]): unknown;
    accountChange(...args: unknown[]): unknown;
}

export interface FxWallet extends EventEmitter<FxWalletEvents> {
    publicKey?: string;
    isAvailable(): Promise<boolean>;
    signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
    decrypt(cipherText: string, tpk?: string, programId?: string, functionName?: string, index?: number): Promise<{ text: string }>,
    requestRecords(program: string): Promise<{ records: any[] }>,
    requestTransaction(transaction: AleoTransaction): Promise<{ transactionId?: string}>,
    requestExecution(transaction: AleoTransaction): Promise<{ transactionId?: string}>,
    requestBulkTransactions(transactions: AleoTransaction[]): Promise<{ transactionIds?: string[] }>,
    requestDeploy(deployment: AleoDeployment): Promise<{ transactionId?: string}>,
    transactionStatus(transactionId: string): Promise<{ status: string }>,
    transitionViewKeys(transactionId: string): Promise<{ viewKeys?: string[] }>,
    getExecution(transactionId: string): Promise<{ execution: string }>,
    requestRecordPlaintexts(program: string): Promise<{ records: any[] }>,
    requestTransactionHistory(program: string): Promise<{ transactions: any[] }>,
    connect(decryptPermission: DecryptPermission, network: WalletAdapterNetwork, programs?: string[]): Promise<void>;
    disconnect(): Promise<void>;
}

export interface FxWindow extends Window {
    fxWallet?: {
        aleo: FxWallet;
    };
    aleo?: FxWallet;
}

declare const window: FxWindow;

export interface FxWalletAdapterConfig {
}

export const FxWalletName = 'FxWallet' as WalletName<'FxWallet'>;

export class FxWalletAdapter extends BaseMessageSignerWalletAdapter {
    name = FxWalletName;
    icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMzEiIHZpZXdCb3g9IjAgMCAyNSAzMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMS44ODY3IDMwLjU1NzRDMjAuMTc1OSAzMC41NTc0IDE4Ljc4NTIgMjkuMTc3NyAxOC43ODUyIDI3LjQ3NzlDMTguNzg1MiAyNS43NzgxIDIwLjE3NTkgMjQuMzk4NCAyMS44ODY3IDI0LjM5ODRDMjMuNjA4NSAyNC4zOTg0IDI0Ljk5OTMgMjUuNzc4MSAyNC45OTkzIDI3LjQ3NzlDMjQuOTk5MyAyOS4xNzc3IDIzLjYwODUgMzAuNTU3NCAyMS44ODY3IDMwLjU1NzRaIiBmaWxsPSIjMDBBMEU5Ii8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTguNzA4NSA2LjE1ODkyQzE1LjI0MjggNi4xNTg5MiAxMi40MjgyIDguOTYyNDQgMTIuNDI4MiAxMi4zOTUxVjEyLjQ3MjRIMjEuODk4NEMyMy42MDkyIDEyLjQ3MjQgMjQuOTk5OSAxMy44NTIgMjQuOTk5OSAxNS41NTE4QzI0Ljk5OTkgMTcuMjUxNiAyMy42MDkyIDE4LjYzMTMgMjEuODk4NCAxOC42MzEzSDEyLjQyODJWMTguNzA4NUMxMi40MjgyIDIwLjA5OTMgMTIuMTg1NCAyMS40NDU4IDExLjc1NDkgMjIuNjkzMUMxMC41NTE4IDI2LjIwMyA3LjgwMzUgMjkuMDA2NSA0LjMyNjY5IDMwLjMwODlDNC4zMTU2NiAzMC4zMiA0LjI5MzU4IDMwLjMyIDQuMjgyNTQgMzAuMzMxQzQuMjYwNDcgMzAuMzMxIDQuMjM4MzkgMzAuMzQyIDQuMjA1MjggMzAuMzUzMUMzLjg2MzEyIDMwLjQ4NTUgMy40OTg4OCAzMC41NTE4IDMuMTEyNTcgMzAuNTUxOEMxLjM5MDcyIDMwLjU1MTggMCAyOS4xNzIxIDAgMjcuNDcyM0MwIDI2LjEzNjggMC44NjA5MjQgMjQuOTk5OSAyLjA2NDAxIDI0LjU2OTRDNC40ODEyMiAyMy42OTc1IDYuMjE0MSAyMS40MDE3IDYuMjE0MSAxOC43MDg1VjE4LjYzMTNIMy4xMDE1M0MxLjM5MDcyIDE4LjYzMTMgMCAxNy4yNTE2IDAgMTUuNTUxOEMwIDEzLjg1MiAxLjM5MDcyIDEyLjQ3MjQgMy4xMDE1MyAxMi40NzI0SDYuMjE0MVYxMi4zOTUxQzYuMjE0MSA1LjU2Mjg5IDExLjgyMTEgMCAxOC43MDg1IDBIMjEuODg3M0MyMy42MDkyIDAgMjQuOTk5OSAxLjM3OTY5IDI0Ljk5OTkgMy4wNzk0NkMyNC45OTk5IDQuNzc5MjMgMjMuNjA5MiA2LjE1ODkyIDIxLjg5ODQgNi4xNTg5MkgxOC43MDg1WiIgZmlsbD0iIzAwQTBFOSIvPgo8L3N2Zz4K';
    url: string;
    readonly supportedTransactionVersions = null;

    private _connecting: boolean;
    private _wallet: FxWallet | null;
    private _publicKey: string | null;
    private _decryptPermission: string;
    private _readyState: WalletReadyState =
        typeof window === 'undefined' || typeof document === 'undefined'
            ? WalletReadyState.Unsupported
            : WalletReadyState.NotDetected;

    constructor({} : FxWalletAdapterConfig = {}) {
        super();
        this._connecting = false;
        this._wallet = null;
        this._publicKey = null;
        this._decryptPermission = DecryptPermission.NoDecrypt;
        this.url = "https://foxwallet.com/download"

        if (this._readyState !== WalletReadyState.Unsupported) {
            scopePollingDetectionStrategy(() => {
                if (window?.fxWallet?.aleo) {
                    this._readyState = WalletReadyState.Installed;
                    this.emit('readyStateChange', this._readyState);
                    return true;
                }
                return false;
            });
        }
    }

    get publicKey() {
        return this._publicKey;
    }

    get decryptPermission() {
        return this._decryptPermission;
    }

    get connecting() {
        return this._connecting;
    }

    get readyState() {
        return this._readyState;
    }

    set readyState(readyState) {
        this._readyState = readyState;
    }

    async decrypt(cipherText: string, tpk?: string, programId?: string, functionName?: string, index?: number) {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();
            switch (this._decryptPermission) {
                case DecryptPermission.NoDecrypt:
                    throw new WalletDecryptionNotAllowedError();

                case DecryptPermission.UponRequest:
                case DecryptPermission.AutoDecrypt:
                case DecryptPermission.OnChainHistory:
                {
                    try {
                        const text = await wallet.decrypt(cipherText, tpk, programId, functionName, index);
                        return text.text;
                    } catch (error: any) {
                        throw new WalletDecryptionError(error?.message, error);
                    }
                }
                default:
                    throw new WalletDecryptionError();
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async requestRecords(program: string): Promise<any[]> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();

            try {
                const result = await wallet.requestRecords(program);
                return result.records;
            } catch (error: any) {
                throw new WalletRecordsError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async requestTransaction(transaction: AleoTransaction): Promise<string> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();
            try {
                const result = await wallet.requestTransaction(transaction);
                return result.transactionId;
            } catch (error: any) {
                throw new WalletTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async requestExecution(transaction: AleoTransaction): Promise<string> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();
            try {
                const result = await wallet.requestExecution(transaction);
                return result.transactionId;
            } catch (error: any) {
                throw new WalletTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async requestBulkTransactions(transactions: AleoTransaction[]): Promise<string[]> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();
            try {
                const result = await wallet.requestBulkTransactions(transactions);
                return result.transactionIds;
            } catch (error: any) {
                throw new WalletTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async requestDeploy(deployment: AleoDeployment): Promise<string> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();
            try {
                const result = await wallet.requestDeploy(deployment);
                return result.transactionId;
            } catch (error: any) {
                throw new WalletTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async transactionStatus(transactionId: string): Promise<string> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();
            try {
                const result = await wallet.transactionStatus(transactionId);
                return result.status;
            } catch (error: any) {
                throw new WalletTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async transitionViewKeys(transactionId: string): Promise<string[]> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();
            try {
                const result = await wallet.transitionViewKeys(transactionId);
                return result.viewKeys;
            } catch (error: any) {
                throw new WalletTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async getExecution(transactionId: string): Promise<string> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();
            try {
                const result = await wallet.getExecution(transactionId);
                return result.execution;
            } catch (error: any) {
                throw new WalletTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async requestRecordPlaintexts(program: string): Promise<any[]> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();

            try {
                const result = await wallet.requestRecordPlaintexts(program);
                return result.records;
            } catch (error: any) {
                throw new WalletRecordsError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async requestTransactionHistory(program: string): Promise<any[]> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();

            try {
                const result = await wallet.requestTransactionHistory(program);
                return result.transactions;
            } catch (error: any) {
                throw new WalletRecordsError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }

    async connect(decryptPermission: DecryptPermission, network: WalletAdapterNetwork, programs?: string[]): Promise<void> {
        try {
            if (this.connected || this.connecting) return;
            if (this._readyState !== WalletReadyState.Installed) throw new WalletNotReadyError();

            this._connecting = true;

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const wallet = window.fxWallet?.aleo

            try {
                await wallet.connect(decryptPermission, network, programs);
                if (!wallet?.publicKey) {
                    throw new WalletConnectionError();
                }
                this._publicKey = wallet.publicKey!;
            } catch (error: any) {
                throw new WalletConnectionError(error?.message, error);
            }

            this._wallet = wallet;
            this._decryptPermission = decryptPermission;
            this.emit('connect', this._publicKey);
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        } finally {
            this._connecting = false;
        }
    }

    async disconnect(): Promise<void> {
        const wallet = this._wallet;
        if (wallet) {
            // wallet.off('disconnect', this._disconnected);

            this._wallet = null;
            this._publicKey = null;

            try {
                await wallet.disconnect();
            } catch (error: any) {
                this.emit('error', new WalletDisconnectionError(error?.message, error));
            }
        }

        this.emit('disconnect');
    }

    async signMessage(message: Uint8Array): Promise<Uint8Array> {
        try {
            const wallet = this._wallet;
            if (!wallet || !this.publicKey) throw new WalletNotConnectedError();

            try {
                const signature = await wallet.signMessage(message);
                return signature.signature;
            } catch (error: any) {
                throw new WalletSignTransactionError(error?.message, error);
            }
        } catch (error: any) {
            this.emit('error', error);
            throw error;
        }
    }
}