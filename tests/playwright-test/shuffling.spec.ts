/**
 * Copyright Microsoft Corporation. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { test, expect } from './playwright-test-fixtures';
import { shuffleTestGroups } from '../../packages/playwright/src/runner/shuffle';
import type { TestGroup } from '../../packages/playwright/src/runner/testGroups';

test.describe('Test Shuffling', () => {
  const mockTestGroups: TestGroup[] = [
    { workerHash: 'hash1', requireFile: 'file1.js', repeatEachIndex: 0, projectId: 'project1', tests: [{ title: 'test1' } as any] },
    { workerHash: 'hash2', requireFile: 'file2.js', repeatEachIndex: 0, projectId: 'project1', tests: [{ title: 'test2' } as any] },
    { workerHash: 'hash3', requireFile: 'file3.js', repeatEachIndex: 0, projectId: 'project1', tests: [{ title: 'test3' } as any] },
    { workerHash: 'hash4', requireFile: 'file4.js', repeatEachIndex: 0, projectId: 'project1', tests: [{ title: 'test4' } as any] },
    { workerHash: 'hash5', requireFile: 'file5.js', repeatEachIndex: 0, projectId: 'project1', tests: [{ title: 'test5' } as any] },
  ];

  test('should not shuffle when no seed provided', () => {
    const result = shuffleTestGroups(mockTestGroups, '');
    expect(result).toEqual(mockTestGroups);
  });

  test('should not shuffle when seed is null', () => {
    const result = shuffleTestGroups(mockTestGroups, null as any);
    expect(result).toEqual(mockTestGroups);
  });

  test('should not shuffle when only one test group', () => {
    const singleGroup = [mockTestGroups[0]];
    const result = shuffleTestGroups(singleGroup, 'test-seed');
    expect(result).toEqual(singleGroup);
  });

  test('should produce deterministic results with same seed', () => {
    const shuffle1 = shuffleTestGroups(mockTestGroups, 'test-seed');
    const shuffle2 = shuffleTestGroups(mockTestGroups, 'test-seed');
    expect(shuffle1).toEqual(shuffle2);
  });

  test('should produce different results with different seeds', () => {
    const shuffle1 = shuffleTestGroups(mockTestGroups, 'seed1');
    const shuffle2 = shuffleTestGroups(mockTestGroups, 'seed2');
    expect(shuffle1).not.toEqual(shuffle2);
  });

  test('should preserve all original items', () => {
    const shuffled = shuffleTestGroups(mockTestGroups, 'preservation-test');
    
    // Check that all original items are preserved
    const originalFiles = mockTestGroups.map(g => g.requireFile).sort();
    const shuffledFiles = shuffled.map(g => g.requireFile).sort();
    expect(shuffledFiles).toEqual(originalFiles);
    
    // Check that all items are present (no duplicates, no missing items)
    expect(shuffled).toHaveLength(mockTestGroups.length);
    
    // Check that each item appears exactly once
    const shuffledFileSet = new Set(shuffled.map(g => g.requireFile));
    const originalFileSet = new Set(mockTestGroups.map(g => g.requireFile));
    expect(shuffledFileSet).toEqual(originalFileSet);
  });

  test('should maintain test group structure', () => {
    const shuffled = shuffleTestGroups(mockTestGroups, 'structure-test');
    
    // Check that each test group maintains its structure
    for (const group of shuffled) {
      expect(group).toHaveProperty('workerHash');
      expect(group).toHaveProperty('requireFile');
      expect(group).toHaveProperty('repeatEachIndex');
      expect(group).toHaveProperty('projectId');
      expect(group).toHaveProperty('tests');
      expect(Array.isArray(group.tests)).toBe(true);
    }
  });

  test('should produce consistent shuffling across multiple runs', () => {
    const seed = 'consistency-test';
    const results: TestGroup[][] = [];
    
    // Run shuffling multiple times with the same seed
    for (let i = 0; i < 5; i++) {
      results.push(shuffleTestGroups(mockTestGroups, seed));
    }
    
    // All results should be identical
    for (let i = 1; i < results.length; i++) {
      expect(results[i]).toEqual(results[0]);
    }
  });
});
