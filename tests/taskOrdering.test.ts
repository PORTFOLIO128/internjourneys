import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortTasksBySequence } from '../lib/taskOrdering';
import type { Task } from '../lib/types';

function createTask(taskNumber: number | string): Task {
  return {
    id: String(taskNumber),
    domainId: 'domain',
    title: `Task ${taskNumber}`,
    taskNumber,
    description: '',
    status: 'Available',
  };
}

test('student tasks sort by task number in ascending order', () => {
  const sorted = sortTasksBySequence([
    createTask(4),
    createTask(1),
    createTask('2'),
    createTask('in'),
    createTask(3),
  ]);

  assert.deepEqual(
    sorted.map(({ taskNumber }) => taskNumber),
    [1, '2', 3, 4, 'in']
  );
});
