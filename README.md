# Daylist

A simple to-do list built with HTML, CSS, and JavaScript. No framework or installation required.

## Run the app

Open `index.html` in your browser. Alternatively, run `python3 -m http.server 8000` from this folder, then visit `http://localhost:8000`.

## Use it

- Type a task and click **Add task** (or press Enter).
- Click **Edit**, update the text, then **Save**. **Cancel** or Escape discards the edit.
- Check a task to mark it done. Uncheck it to mark it as to do again.
- Use **All tasks**, **To do**, and **Done** to filter your list.

Tasks save automatically in this browser using `localStorage`. They do not sync between devices; clearing browser storage removes them.

## Learn from the code

- `index.html` defines the page structure, form, and task list.
- `style.css` controls the colors, spacing, and mobile layout. Optional Google Fonts have sans-serif fallbacks.
- `app.js` stores tasks in an array of objects: `{ id, title, done }`.
- Event listeners respond to submitting a form or clicking a control.
- `renderTasks()` updates the page to match the array.
- `saveTasks()` converts the array to JSON and saves it in `localStorage`.

Try changing the colors in `style.css`, or the encouraging messages in `app.js`, to make it your own.
