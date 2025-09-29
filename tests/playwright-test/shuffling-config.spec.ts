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

test.describe('Shuffling Configuration', () => {
  test('should accept shardingSeed configuration', async ({ runInlineTest }) => {
    const result = await runInlineTest({
      'playwright.config.ts': `
        import { defineConfig } from '@playwright/test';
        export default defineConfig({
          shardingSeed: 'test-seed-123'
        });
      `,
      'test.spec.ts': `
        import { test } from '@playwright/test';
        test('test 1', async () => {
          console.log('test1');
        });
        test('test 2', async () => {
          console.log('test2');
        });
        test('test 3', async () => {
          console.log('test3');
        });
      `
    });
    expect(result.exitCode).toBe(0);
  });

  test('should work without shardingSeed configuration', async ({ runInlineTest }) => {
    const result = await runInlineTest({
      'playwright.config.ts': `
        import { defineConfig } from '@playwright/test';
        export default defineConfig({});
      `,
      'test.spec.ts': `
        import { test } from '@playwright/test';
        test('test 1', async () => {
          console.log('test1');
        });
        test('test 2', async () => {
          console.log('test2');
        });
      `
    });
    expect(result.exitCode).toBe(0);
  });

  test('should work with shardingSeed and sharding together', async ({ runInlineTest }) => {
    const result = await runInlineTest({
      'playwright.config.ts': `
        import { defineConfig } from '@playwright/test';
        export default defineConfig({
          shardingSeed: 'shard-test-seed',
          shard: { total: 2, current: 1 }
        });
      `,
      'test1.spec.ts': `
        import { test } from '@playwright/test';
        test('test 1', async () => {
          console.log('test1');
        });
      `,
      'test2.spec.ts': `
        import { test } from '@playwright/test';
        test('test 2', async () => {
          console.log('test2');
        });
      `,
      'test3.spec.ts': `
        import { test } from '@playwright/test';
        test('test 3', async () => {
          console.log('test3');
        });
      `
    });
    expect(result.exitCode).toBe(0);
  });
});
