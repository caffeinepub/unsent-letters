import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    id: bigint;
    to: string;
    color: string;
    song: string;
    message: string;
    timestamp: bigint;
}
export interface backendInterface {
    getMessages(): Promise<Array<Message>>;
    searchMessages(queryString: string): Promise<Array<Message>>;
    submitMessage(to: string, message: string, song: string, color: string): Promise<bigint>;
}
