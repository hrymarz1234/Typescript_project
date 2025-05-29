import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('jan');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('1234');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await page.getByRole('button', { name: 'Edytuj' }).nth(3).click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('test22');
  await page.getByText('test').click();
  await page.getByRole('button', { name: 'Edytuj projekt' }).click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(3).click();
  await page.getByRole('button', { name: 'Edytuj' }).first().click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('test2');
  await page.getByText('test').click();
  await page.getByText('test').fill('test2');
  await page.getByRole('combobox').first().selectOption('low');
  await page.getByRole('combobox').nth(1).selectOption('done');
  await page.getByRole('button', { name: 'Edytuj historyjkę' }).click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(3).click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(3).click();
  await page.getByRole('button', { name: 'Wybierz' }).first().click();
  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('test2213');
  await page.getByText('test').click();
  await page.getByText('test').fill('test3');
  await page.getByRole('button', { name: 'Zapisz zmiany' }).click();
});