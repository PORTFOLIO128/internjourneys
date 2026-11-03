import assert from 'node:assert/strict';
import test from 'node:test';
import type { Task } from '../lib/types';
import { sortTasksBySequence } from '../lib/taskOrdering';

const task = (id: string, taskNumber: number | string, isCertificateTask = false): Task => ({
  id,
  taskNumber,
  title: id,
  dueDate: '',
  status: 'Available',
  description: '',
  isCertificateTask,
});

test('student tasks sort by task number in ascending order', () => {
  const sorted = sortTasksBySequence([
    task('task-3', '3'),
    task('task-2', 2),
    task('task-1', 1),
    task('task-4', 4),
    task('task-5', 5, true),
    task('intro', 'in'),
  ]);

  assert.deepEqual(sorted.map(({ id }) => id), ['task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'intro']);
});
