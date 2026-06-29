import { expect, Page, Locator } from '@playwright/test';
export async function selectRandomHouse(
  page: Page,
  input: Locator
): Promise<string | null> {

  const houseChoices: string[] = ['1', '2', '3','5','6'];

  const randomHouse =
    houseChoices[Math.floor(Math.random() * houseChoices.length)];


  await input.fill(randomHouse);


  const houseInput = page
    .locator("input[role='combobox']")
    .nth(1);


  await expect(houseInput)
    .toHaveAttribute('aria-expanded', 'true');


  const option = page
    .getByRole('presentation')
    .getByRole('option')
    .first();


  await option.waitFor();


  const selectedHouse = await option.innerText();

  await option.click();
  return selectedHouse;
}