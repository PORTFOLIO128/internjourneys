import type { Task } from './types';

export function sortTasksBySequence(tasks: readonly Task[]): Task[] {
  const sequenceFor = (task: Task) => {
    const sequence = typeof task.taskNumber === 'number'
      ? task.taskNumber
      : /^\s*\d+\s*$/.test(task.taskNumber)
        ? Number(task.taskNumber)
        : Number.POSITIVE_INFINITY;
    return Number.isFinite(sequence) ? sequence : Number.POSITIVE_INFINITY;
  };

  return [...tasks].sort((a, b) => {
    const sequenceA = sequenceFor(a);
    const sequenceB = sequenceFor(b);
    if (sequenceA === sequenceB) return 0;
    return sequenceA < sequenceB ? -1 : 1;
  });
}
