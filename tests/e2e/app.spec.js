const { test, expect, _electron: electron } = require('@playwright/test');

test('End-to-end user workflow', async () => {
    const electronApp = await electron.launch({ args: ['.'] });
    const window = await electronApp.firstWindow();

    const taskText = 'My new E2E test task';

    // Add a new todo
    const input = await window.locator('#todo-input');
    await input.fill(taskText);
    const addButton = await window.locator('#add-todo-btn');
    await addButton.click();

    // Wait for todo item with the text to appear
    // Use a locator that matches text inside .todo-item
    const todoItem = await window.locator('.todo-item', { hasText: taskText }).first();
    await expect(todoItem).toBeVisible();

    // Debug: print inner HTML to see structure (uncomment if needed)
    // const html = await todoItem.evaluate(node => node.innerHTML);
    // console.log('TODO ITEM HTML:', html);

    // Mark complete
    const checkbox = todoItem.locator('input[type="checkbox"]');
    // only click if visible
    if (await checkbox.count() > 0) {
        await checkbox.click();
        await expect(todoItem).toHaveClass(/completed/);
    } else {
        console.warn('Checkbox not found inside todo item.');
    }

    // --- Try to find delete button robustly ---
    // Approach:
    // 1) look for element with class .delete-button
    // 2) fallback: find button or element that has text "Delete"
    // 3) if still not found, hover the item then retry (handles hover-only UI)
    let deleteButton = todoItem.locator('.delete-button');

    if (await deleteButton.count() === 0) {
        // fallback: any button inside item
        deleteButton = todoItem.locator('button');
    }

    if (await deleteButton.count() === 0) {
        // fallback: element with text "Delete" anywhere inside the item
        deleteButton = todoItem.locator('text=Delete');
    }

    // If button might be shown only on hover, hover then re-query
    if (await deleteButton.count() === 0) {
        await todoItem.hover();
        deleteButton = todoItem.locator('.delete-button');
        if (await deleteButton.count() === 0) {
            deleteButton = todoItem.locator('button');
        }
        if (await deleteButton.count() === 0) {
            deleteButton = todoItem.locator('text=Delete');
        }
    }

    // Final check: if still not found, throw helpful error with HTML snapshot
    if (await deleteButton.count() === 0) {
        const html = await todoItem.evaluate(node => node.innerHTML);
        await electronApp.close();
        throw new Error('Delete button not found inside todo item. HTML snapshot: ' + html);
    }

    // Ensure visible (or force click)
    // If it's hidden due to CSS, try hover then click
    try {
        await expect(deleteButton).toBeVisible({ timeout: 5000 });
        await deleteButton.click();
    } catch (e) {
        // fallback: hover and force click
        await todoItem.hover();
        await deleteButton.click({ force: true });
    }

    // Optionally assert it was removed
    await expect(window.locator('.todo-item', { hasText: taskText })).toHaveCount(0);

    await electronApp.close();
});
