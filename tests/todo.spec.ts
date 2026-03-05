import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

// --- Adding todos ---

test('should add a todo item', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Buy milk')
  await page.keyboard.press('Enter')
  await expect(page.getByText('Buy milk')).toBeVisible()
})

test('should add a todo by clicking Add button', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Walk the dog')
  await page.getByRole('button', { name: 'Addt' }).click()
  await expect(page.getByText('Walk the dog')).toBeVisible()
})

test('should not add an empty todo', async ({ page }) => {
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.locator('.todo-list')).not.toBeVisible()
})

test('should clear input after adding', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Clean desk')
  await page.keyboard.press('Enter')
  await expect(page.getByPlaceholder('Add a task')).toHaveValue('')
})

// --- Completing todos ---

test('should mark a todo as complete', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Walk the dog')
  await page.keyboard.press('Enter')
  await page.getByText('Walk the dog').click()
  await expect(page.getByText('Walk the dog')).toHaveClass(/completed/)
})

test('should toggle a todo back to active', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Read a book')
  await page.keyboard.press('Enter')
  await page.getByText('Read a book').click()
  await page.getByText('Read a book').click()
  await expect(page.getByText('Read a book')).not.toHaveClass(/completed/)
})

// --- Deleting todos ---

test('should delete a todo item', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Clean desk')
  await page.keyboard.press('Enter')
  await page.getByText('Clean desk').hover()
  await page.getByRole('button', { name: 'Delete' }).click()
  await expect(page.getByText('Clean desk')).not.toBeVisible()
})

// --- Filters ---

test('should filter active todos', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Active task')
  await page.keyboard.press('Enter')
  await page.getByPlaceholder('Add a task').fill('Done task')
  await page.keyboard.press('Enter')
  await page.getByText('Done task').click()

  await page.getByRole('button', { name: 'Active' }).click()
  await expect(page.getByText('Active task')).toBeVisible()
  await expect(page.getByText('Done task')).not.toBeVisible()
})

test('should filter completed todos', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Active task')
  await page.keyboard.press('Enter')
  await page.getByPlaceholder('Add a task').fill('Done task')
  await page.keyboard.press('Enter')
  await page.getByText('Done task').click()

  await page.getByRole('button', { name: 'Completed', exact: true }).click()
  await expect(page.getByText('Done task')).toBeVisible()
  await expect(page.getByText('Active task')).not.toBeVisible()
})

// --- Footer ---

test('should show correct item count', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Task one')
  await page.keyboard.press('Enter')
  await page.getByPlaceholder('Add a task').fill('Task two')
  await page.keyboard.press('Enter')
  await expect(page.getByText('2 items left')).toBeVisible()
})

test('should update count when todo is completed', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Task one')
  await page.keyboard.press('Enter')
  await page.getByPlaceholder('Add a task').fill('Task two')
  await page.keyboard.press('Enter')
  await page.getByText('Task one').click()
  await expect(page.getByText('1 item left')).toBeVisible()
})

test('should clear completed todos', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Keep this')
  await page.keyboard.press('Enter')
  await page.getByPlaceholder('Add a task').fill('Remove this')
  await page.keyboard.press('Enter')
  await page.getByText('Remove this').click()
  await page.getByRole('button', { name: 'Clear completed' }).click()
  await expect(page.getByText('Remove this')).not.toBeVisible()
  await expect(page.getByText('Keep this')).toBeVisible()
})

// --- Empty state ---

test('should show empty state message initially', async ({ page }) => {
  await expect(page.getByText('No tasks yet. Add one above.')).toBeVisible()
})

test('should hide empty state when todos exist', async ({ page }) => {
  await page.getByPlaceholder('Add a task').fill('Something')
  await page.keyboard.press('Enter')
  await expect(page.getByText('No tasks yet. Add one above.')).not.toBeVisible()
})
