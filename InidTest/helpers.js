export async function fillInput(page, value) {
  for (let i = 0; i < 7; i++) {
    await page
      .locator(
        '//div[contains(@class,"main-step MuiBox-root")]//input[contains(@class,"MuiInputBase-input MuiOutlinedInput-input css-1x5jdmq")]'
      )
      .nth(i)
      .fill(String(value[i]));
  }
}

export async function fillLogin(page, email, password) {
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

export async function selectRandomHouse(page, inputLocator) {
  let selected = true;
  while (selected) {
    const randomHouse = Math.floor(Math.random() * (100 - 1) + 1);
    await inputLocator.fill(String(randomHouse));
    await page.waitForTimeout(1000);

    const expanded = await inputLocator.getAttribute('aria-expanded');
    if (expanded === 'true') {
      const optionLocator = page.getByRole('option').first();
      const selectedText = await optionLocator.textContent(); // get text
      await optionLocator.click(); // click it
      return selectedText;
    }
  }
}
export async function selectRandomOptionFromOpenedList(page) {
  const options = page.getByRole('option');
  const count = await options.count();

  // skip index 0 = "Не выбрано"
  const randomIndex = Math.floor(Math.random() * (count - 1)) + 1;

  const option = options.nth(randomIndex);

  await option.click();
}
export async function selectRandomGroupList(groupLocator) {
  // Находим все группы
  const groups = groupLocator.locator('[role="group"]');
  const groupsCount = await groups.count();

  for (let i = 0; i < groupsCount; i++) {
    const group = groups.nth(i);

    // Получаем все кнопки внутри группы
    const buttons = group.getByRole('button');
    const btnCount = await buttons.count();

    if (btnCount === 0) continue;

    // Выбираем случайную кнопку
    const randomIndex = Math.floor(Math.random() * btnCount);
    await buttons.nth(randomIndex).click();
  }
}


export async function fillObjectDetails(page) {
  const comboboxes = page.locator(
    '//div[contains(@class,"main-step__grid")]//div[@role="combobox"]'
  );

  for (let i = 0; i < await comboboxes.count(); i++) {
    await comboboxes.nth(i).click();
     await selectRandomOptionFromOpenedList(page);
  }

  const toggles = page.locator(
    '//div[contains(@class,"main-step__grid")]//label//span[contains(@class,"MuiSwitch-switchBase")]'
  );
  await toggles.first().click();

  const kitchenCheckbox = page.locator(
    '//div[contains(@class,"main-step__grid")]//label//span[contains(@class,"MuiCheckbox-root")]'
  );
  await kitchenCheckbox.click();

  await toggles.nth(1).click();

  const lastInput = page.locator(
    '//div[contains(@class,"main-step MuiBox-root css-1i43dhb")]//input[contains(@class,"MuiInputBase-input MuiOutlinedInput-input css-1x5jdmq")]'
  ).last();
  await lastInput.fill('3000000');

  await comboboxes.nth(4).click();
  await page.getByRole('option').nth(3).click();
}

export async function fillObjectAddInfo(page) {
  const block = page
    .locator('p', { hasText: 'Дополнительные параметры' })
    .locator('xpath=following-sibling::div[contains(@class,"MuiBox-root")]')
    .first();

  const comboboxes = block.locator('[role="combobox"]');
  for (let i = 0; i < await comboboxes.count(); i++) {
    await comboboxes.nth(i).click();
    await selectRandomOptionFromOpenedList(page);

  }
}

// --- Helpers ---
// Randomly select an option from a combobox, skipping the first element
export async function selectRandomOption(page, comboboxLocator) {
  await comboboxLocator.click();
  const options = page.getByRole('option');
  const count = await options.count();

  // случайный индекс от 1 до count-1 (пропускаем первый)
  const randomIndex = Math.floor(Math.random() * (count - 1)) + 1;
  const optionLocator = options.nth(randomIndex);
  const randomOptionText = await optionLocator.textContent(); // ✅ get the text
  await optionLocator.click();
  return randomOptionText;
}

// Randomly fill a placeholder input from an array
export async function fillRandomFromArray(page, placeholder, values) {
  const randomIndex = Math.floor(Math.random() * values.length);
  const value = values[randomIndex];

  await page.getByPlaceholder(placeholder).fill(value);

  // Если это autocomplete, выбрать первый появившийся вариант
  await page.getByRole('option').first().click();

  return value;
}
