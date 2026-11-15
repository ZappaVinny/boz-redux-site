# Testing your mod

A test plays your map or mod by itself: it starts the game, runs the steps you wrote, checks what
happened and writes a report with screenshots. Run your tests before you share a new version, and
you'll know the doors still open and the scripts still run, on 32-bit and 64-bit builds alike.

## What a test is

A test is a Lua file in your project's or mod's `tests/` folder, for example `tests/doors.lua`.
When you run it, the client starts without a window, opens your map, runs the test's steps in
order and closes. Each step can check things and take screenshots. The result is a report page.

A mod without tests still gets a quick check: it starts the mod's map (or the main menu), plays a
few seconds and makes sure no Lua errors happen.

## Your first test

```lua
--! timeout: 240
local boz = require("boz")

test.start_map("my_map", {UnlimitedHealth = true})

test.step("the match starts", function()
    test.wait_until(test.in_match, 120, "the match")
    test.wait(2)
    test.screenshot("start")
end)

test.step("the vault door opens", function()
    local door = boz.get("VaultDoor")
    test.expect(door ~= nil, "the map has VaultDoor")
    door:open()
    test.wait_until(function() return door:is_open() end, 5, "the door to open")
    test.screenshot("door_open")
end)

test.step("no Lua errors", function()
    test.expect(test.errors() == 0, test.errors() .. " Lua errors")
end)
```

`test.start_map` goes at the top: it starts a match on the map once the main menu is up, with
console variables set first. Then each `test.step` runs when the one before it is done. The test
script runs like any script of your mod, so `require("boz")` and everything in the
[Scripting reference](scripting.md) works.

## Steps and checks

| Function | What it does |
| --- | --- |
| `test.start_map(name, vars)` | Starts a single-player match on the map. `vars`: console variables, e.g. `{UnlimitedHealth = true}`. |
| `test.coop_map(name, vars)` | Opens a Wi-Fi co-op room for the map (see [Co-op tests](#co-op-tests)). |
| `test.step(name, fn)` | Adds a step. Steps run one after another. |
| `test.expect(ok, message)` | Records a failure when `ok` is false. The step goes on. |
| `test.fail(message)` | Ends the step with a failure. |
| `test.wait(seconds)` | Lets the game run for that long. |
| `test.frames(count)` | Lets the game run for that many frames (default 1). |
| `test.wait_until(fn, seconds, what)` | Waits until `fn()` returns a true value and returns it. After `seconds` (default 60) the step fails with "timed out waiting for `what`". |
| `test.in_match()` | True once a Zombies match is running with your player in it. |
| `test.screenshot(name)` | Saves the next frame as `name.png` in the report. |
| `test.errors()` | How many Lua errors any mod has raised so far. |
| `test.time()` | Seconds since the test started (game time). |

A failed wait, `test.fail` or an error ends that step, and the test stops there. Set
`test.keep_going = true` to run the remaining steps anyway. (`test.expect` only records a failure:
the step goes on.) A test fails when any step fails, and also when a mod
raised a Lua error, unless you set `test.allow_errors = true`.

## Touch screens

To test a phone layout, add `--! touch: true` at the top. The game then runs in touch-screen
mode, and fingers reach it:

| Function | What it does |
| --- | --- |
| `test.tap(x, y)` | A tap. `x` and `y` go from 0 to 1 across the window. |
| `test.drag(x1, y1, x2, y2, seconds, hold)` | Drags a finger over `seconds` (default 0.5), then lifts it unless `hold` is true. |
| `test.touch(id, action, x, y)` | One finger (`id` 0-9): `"down"`, `"move"` or `"up"`. |

## Options

Lines starting with `--!` at the top of the test set how it runs:

| Option | Example | What it does |
| --- | --- | --- |
| `timeout` | `--! timeout: 240` | Seconds before the test counts as stuck (default 300). |
| `touch` | `--! touch: true` | Touch-screen mode. |
| `players` | `--! players: 2` | A co-op test with a host and a guest. |
| `mods` | `--! mods: developer` | Other installed mods to switch on for the test (comma-separated). |
| `arch` | `--! arch: x64` | Only on these builds. |

Each run gets its own settings file and a copy of the saves, so your own settings and saves are
never touched.

## Co-op tests

With `--! players: 2`, two games run the same test, one as the host and one as the guest, and
`test.role` says which (`"host"` or `"guest"`). Both call `test.coop_map`: the host's room opens
and the guest joins it.

```lua
--! players: 2
--! timeout: 240
test.coop_map("my_map", {UnlimitedHealth = true, MultiplayerLobbyTimeWifiMs = 5000})

test.step("both players are in", function()
    test.wait_until(test.in_match, 180, "the co-op match")
    test.wait_until(function() return #require("boz").players() == 2 end, 60, "the other player")
    test.screenshot("coop")
end)
```

`MultiplayerLobbyTimeWifiMs` shortens the lobby's countdown. See
[Scripts in co-op](coop-scripting.md) for what each game runs.

## Running tests

In the SDK app, open your project and click **Run tests**. It builds the project, runs every test
and opens the report.

From the command line:

```bash
bozkit test my_project --client /path/to/client
```

| Option | What it does |
| --- | --- |
| `--client` | The client folder (with the game installed). |
| `--arch x86,x64` | Which client builds to use (default: every build found). |
| `--only doors` | Only these tests (file names without `.lua`). |
| `--report folder` | Where the report goes (default `<client>/test-report`). |
| `--smoke` | Run the quick start-up check instead of the mod's own tests. |
| `--coop-mix` | Co-op tests with the guest on another build than the host (32-bit with 64-bit). |

`bozkit test` takes projects, mod folders or installed mod ids, and runs every installed mod's
tests when you give none. The report, `test-report/index.html`, shows each test on each build with
its steps, the log and the screenshots.

On Windows the game shows its window while a test runs; on Linux it runs without one.
