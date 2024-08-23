export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'text' : IDL.Text,
    'completed' : IDL.Bool,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text], [Result_1], []),
    'deleteTask' : IDL.Func([IDL.Nat], [Result], []),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
    'updateTaskStatus' : IDL.Func([IDL.Nat, IDL.Bool], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
