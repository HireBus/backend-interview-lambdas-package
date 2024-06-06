export type MergeAndOverride<T, U> = Omit<T, keyof U> & U;
