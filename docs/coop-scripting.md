# Scripts in co-op

Your map's scripts work in co-op without any extra code. A wall a script hides is hidden for
everyone, a door a script opens is open for everyone, and a button any player presses runs once.
This page explains how that works, and what to do when you want something on one screen only.

## How it works

In a co-op match every player's game runs your scripts. The games talk to each other through the
game's own connection, so it works on LAN and online alike, with no server change. Games without
BOZ Redux simply ignore these messages.

When the match starts, every BOZ Redux game says which scripted mods it has. If every player has
BOZ Redux and the same scripted mods (same versions), **shared scripts** are on. If not, each game
runs its scripts on its own, as in single player, and the host sees a message saying what's
missing, for example "Shared scripts are off: a player lacks my_map@1.0" or "1 player(s) without
BOZ Redux".

A mod that only helps its own player, like a console or a settings window, can leave itself out
of that check, so players don't all need it:

```lua
boz.net.private()
```

## The host decides

While shared scripts are on, the **host** (the game that runs the match) runs the game logic for
everyone:

| What happens | Where it runs |
| --- | --- |
| A player uses, shoots or walks into one of your objects | On the host, with that player as `player`. |
| Game events (`boz.on("round_started", ...)`) | On the host. Pass `{everyone = true}` to run the handler on every game. |
| `show`, `hide`, moving objects, `boz.end_match`, HUD messages from scripts | The host does it, and every game shows it. |
| Lures | On the host only (it runs the zombies). |
| A key binding (`input.bind`) on a guest | Sent to the host, which runs it as that player's. |
| `boz.local(fn)` | Only on this game: what `fn` changes or shows is not shared. |

So you write your scripts as if for one player, and they come out right for everyone. Use
`boz.local` for things that belong to one screen:

```lua
boz["local"](function()
    boz.player():message("Only you see this")
end)
```

`local` is a Lua keyword, so it's written `boz["local"]`.

## Players

`boz.players()` returns every player in the match, yours and the others. `player:is_local()` says
which one is you.

Calling a function on another player runs it on that player's game: `give_points`, `give_perk`,
`teleport` and the rest work as usual. What they return isn't known on your game, so they return
`nil`. A remote player's `position()` is the one its game last reported (every half second).

## Your own messages

Games can send each other data of their own: numbers, strings, booleans and tables of them.

| Function | What it does |
| --- | --- |
| `boz.net.send(name, data)` | Sends `data` to every other game. |
| `boz.net.on(name, fn)` | Calls `fn(data, from)` when another game sends `name`. |
| `boz.is_host()` | True on the host (and in single player). |
| `boz.net.shared()` | True while shared scripts are on. |
| `boz.net.players()` | Every player, as `boz.players()`. |

A score that every game shows:

```lua
local boz = require("boz")
local kills = 0

boz.net.on("kills", function(data) kills = data.total end)

boz.on("zombie_killed", function()
    if boz.is_host() then
        kills = kills + 1
        boz.net.send("kills", {total = kills})
    end
end)
```

## Limits

- Everyone starts together: a player can't join a match that's already running.
- On a guest, a purchase is paid on the guest's game before the host runs it.
- One shot may be reported by both games, so count hits on the host.

## Testing it

A co-op test runs two games, a host and a guest, on one machine. See
[Co-op tests](testing.md#co-op-tests).
