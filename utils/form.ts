import { Page,Locator } from '@playwright/test';
import { randomSelect } from './random';

//для инпут number
export async function fillInputNumber(
  container: Locator,
  values: string[]
) {
  const inputs = container.locator(
    'input[type="number"]:not([disabled])'
  );

  const count = await inputs.count();


  for (let i = 0; i < count; i++) {

    const input = inputs.nth(i);

    await input.click();
    await input.fill('');

    await input.pressSequentially(values[i], {
      delay: 30,
    });

    await input.press('Tab');
  }
}

//для инпут текста 
export async function inputsText(container:Locator,values:String[]){
  const inputsS = container.locator(
  'input[type="text"]:not([disabled])'
 );
  const count =
 await inputsS.count();

 for(let i=0;i<count;i++){

  await inputsS
   .nth(i)
   .fill(String(values[i]));
 }

}


// для чекбоксов
export async function selectCheckbox(
  page:Page,container:Locator) {
  const comboboxes = container.locator(
    'div [role="combobox"]'
  );

  for (let i = 0; i < await comboboxes.count(); i++) {
    await comboboxes.nth(i).click();
     await randomSelect(page);
  }

  // чекбоксы все 
  const toggles = container.locator(
    'input[type="checkbox"]:not([readonly])'
  );
  for( let i=0;i< await toggles.count();i++){
    await toggles.nth(i).click()
  }
}

// для кнопки в доп 
export async function selectRandomGroupList(container:Locator) {
  const groups = container.locator('[role="group"]');
  const groupsCount = await groups.count();

  for (let i = 0; i < groupsCount; i++) {
    const group = groups.nth(i);

    const buttons = group.getByRole('button');
    const btnCount = await buttons.count();

    if (btnCount === 0) continue;

    const randomIndex = Math.floor(Math.random() * btnCount);
    await buttons.nth(randomIndex).click();
  }
}
