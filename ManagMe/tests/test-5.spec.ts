import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('jan');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Login' }).fill('jan');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).fill('1234');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Zaloguj' }).click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(3).click();
  await page.getByRole('button', { name: 'Edytuj' }).first().click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(3).click();
  await page.getByRole('button', { name: 'Wybierz' }).first().click();
  await page.goto('http://localhost:5173/home');
  await page.getByRole('button', { name: 'Wybierz' }).first().click();
  await page.getByRole('button', { name: 'Wybierz' }).first().click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(1).click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(3).click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(2).click();
  await page.getByRole('button', { name: 'Wybierz' }).click();
  await page.getByRole('button', { name: 'Usuń' }).click();
  await page.getByRole('button', { name: 'Wybierz' }).nth(2).click();
  await page.getByRole('button', { name: 'Usuń' }).click();
  await page.getByRole('button', { name: 'Usuń' }).nth(2).click();
});