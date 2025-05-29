import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('jan1');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('1234');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('jan');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('1234');
  await page.getByRole('textbox', { name: 'Hasło' }).press('Enter');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(3).click();
  await page.getByRole('button', { name: 'Edytuj' }).first().click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(3).click();
  await page.getByRole('button', { name: 'Wybierz' }).first().click();
  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('test22');
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).press('ArrowLeft');
  await page.getByRole('textbox').nth(2).press('ArrowLeft');
  await page.getByRole('textbox').nth(2).press('ArrowLeft');
  await page.getByRole('textbox').nth(2).fill('20min');
  await page.getByRole('combobox').nth(1).selectOption('todo');
  await page.getByRole('button', { name: 'Zapisz zmiany' }).click();
  await page.goto('http://localhost:5173/task/1748532869916');
  await page.getByRole('button', { name: 'Edytuj' }).click();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('test221');
  await page.getByRole('combobox').nth(1).selectOption('doing');
  await page.getByRole('button', { name: 'Zapisz zmiany' }).click();
});