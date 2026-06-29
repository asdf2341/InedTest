
import {Page} from '@playwright/test';

export async function randomSelect(page:Page) {
  const options = page.getByRole('option');
  const count = await options.count();

  const randomIndex = Math.floor(Math.random() * (count - 1)) + 1;

  const option = options.nth(randomIndex);

  await option.click();
}