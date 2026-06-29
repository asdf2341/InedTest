import { Page } from '@playwright/test';


export async function login(
 page: Page,
 email:string,
 password:string
){

  const loginInput = await page
    .locator('p:has-text("Логин")')
    .locator('xpath=ancestor::div[contains(@class,"MuiBox-root")]')
    .locator('input')
    .first();

  const passwordInput = await page
    .locator('p:has-text("Пароль")')
    .locator('xpath=ancestor::div[contains(@class,"MuiBox-root")]')
    .locator('input')
    .nth(1);

  await loginInput.fill(email);
  console.log('Filled email');

  await passwordInput.fill(password);
  console.log('Filled password');

  await page.getByRole('button', { name: 'Войти в систему' }).click();
  console.log('Clicked login');

}