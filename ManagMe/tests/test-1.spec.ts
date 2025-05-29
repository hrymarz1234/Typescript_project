import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('jan1');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('1234');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('jan');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('test');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('test');
  await page.getByRole('button', { name: 'Utwórz projekt' }).click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(3).click();
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('test');
  await page.locator('textarea').click();
  await page.locator('textarea').fill('test');
  await page.getByRole('combobox').first().selectOption('high');
  await page.getByRole('combobox').nth(1).selectOption('doing');
  await page.getByRole('button', { name: 'Dodaj Historyjkę' }).click();
  await page.getByRole('button', { name: 'Wybierz' }).click();
  await page.getByRole('textbox', { name: 'Nazwa zadania' }).click();
  await page.getByRole('textbox', { name: 'Nazwa zadania' }).fill('test');
  await page.getByRole('textbox', { name: 'Opis zadania' }).click();
  await page.getByRole('textbox', { name: 'Opis zadania' }).fill('test');
  await page.getByRole('combobox').selectOption('high');
  await page.getByRole('textbox', { name: 'Szacowany czas (np. 2h)' }).click();
  await page.getByRole('textbox', { name: 'Szacowany czas (np. 2h)' }).fill('10min');
  await page.getByRole('button', { name: 'Dodaj zadanie' }).click();
});