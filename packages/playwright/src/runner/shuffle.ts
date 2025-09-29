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

import type { TestGroup } from './testGroups';

/**
 * A simple seeded random number generator using the Linear Congruential Generator (LCG) algorithm.
 * This ensures deterministic, reproducible shuffling when the same seed is used.
 */
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    // Convert string seed to a numeric seed using a simple hash function
    this.seed = this.hashString(seed);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate the next random number in the sequence.
   * Returns a value between 0 (inclusive) and 1 (exclusive).
   */
  next(): number {
    // LCG formula: (a * seed + c) % m
    // Using constants that provide good randomness properties
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  /**
   * Generate a random integer between min (inclusive) and max (exclusive).
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }
}

/**
 * Shuffle an array using the Fisher-Yates algorithm with a seeded random number generator.
 * This ensures deterministic, reproducible shuffling.
 */
function shuffleArray<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];
  const random = new SeededRandom(seed);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = random.nextInt(0, i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Shuffle test groups using a deterministic seed.
 * This helps distribute slow and fast tests more evenly across shards.
 */
export function shuffleTestGroups(testGroups: TestGroup[], seed: string): TestGroup[] {
  if (!seed || testGroups.length <= 1) {
    return testGroups;
  }
  
  return shuffleArray(testGroups, seed);
}
