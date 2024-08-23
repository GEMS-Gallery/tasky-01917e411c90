import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface Task { 'id' : bigint, 'text' : string, 'completed' : boolean }
export interface _SERVICE {
  'addTask' : ActorMethod<[string], Result_1>,
  'deleteTask' : ActorMethod<[bigint], Result>,
  'getTasks' : ActorMethod<[], Array<Task>>,
  'updateTaskStatus' : ActorMethod<[bigint, boolean], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
