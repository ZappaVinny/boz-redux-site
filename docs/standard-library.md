# Standard library

The standard lib (`boz.*`) is the friendly layer for writing mods: plain functions for the
player, menus, the console and more, with the game's addresses, offsets and events hidden
inside. Mods should use it instead of the client's low-level `game`/`hook` functions
([client Lua API](lua-mods.md#client-lua-api)) wherever it covers what they need.

This page is generated from the comments in `lib/boz/*.lua` (`tools/stdlib/generate_doc.py`); see
[Lua mods](lua-mods.md) for how to use it in a mod.

Using it in a mod: an SDK project's build adds it to the mod as `scripts/boz`; then
`local player = require("boz.player")`. Each mod carries its own copy; copies in different
mods work together.

Functions that need a Zombies match return `nil` (or `false`) outside one instead of failing.

## Contents

- **Gameplay**: [boz.player](#bozplayer), [boz.camera](#bozcamera), [boz.rounds](#bozrounds), [boz.zombies](#bozzombies), [boz.weapons](#bozweapons), [boz.effects](#bozeffects), [boz.score](#bozscore), [boz.pickups](#bozpickups), [boz.pieces](#bozpieces), [boz.map](#bozmap), [boz.fly](#bozfly), [boz.deadops](#bozdeadops)
- **Map scripting**: [boz.world](#bozworld), [boz.prefabs](#bozprefabs), [boz.objects](#bozobjects), [boz.match_events](#bozmatch_events), [boz.timers](#boztimers), [boz.saved](#bozsaved), [boz.hooks](#bozhooks), [boz.game](#bozgame), [boz.levels](#bozlevels)
- **Engine access**: [boz.entities](#bozentities), [boz.components](#bozcomponents), [boz.reflect](#bozreflect), [boz.resources](#bozresources), [boz.physics](#bozphysics), [boz.game_events](#bozgame_events)
- **Controls**: [boz.input](#bozinput)
- **Console**: [boz.console](#bozconsole), [boz.cvars](#bozcvars)
- **Menus and text**: [boz.pause_settings](#bozpause_settings), [boz.text](#boztext)
- **Game UI building blocks**: [boz.iwui](#boziwui), [boz.frontend](#bozfrontend), [boz.flash](#bozflash), [boz.swf](#bozswf), [boz.avm1](#bozavm1)
- **Low-level helpers**: [boz.hash](#bozhash), [boz.enums](#bozenums)

## Gameplay

### boz.player

The local player in a Zombies match: health, place, stance, speed and perks.

```lua
local player = require("boz.player")
player.give_all_perks()
player.health()  player.set_health(500, true)  player.set_god(true)
player.position()  player.teleport({x = 0, y = 250, z = 0})
player.downed()  player.stance()  player.set_speed("SprintSpeed", 1.5)
```

<details><summary>How it works</summary>

the player's entity is CLevelManager +0x1a0; its CHealth keeps its health (+0x48 float, +0x44 the most it can be now; CHealth::SetHealth changes it the game's way); CPlayerController keeps the stance and movement; the type is not a real Lua object but the game memory pointer's fields by name.

</details>

| Function | Description |
| --- | --- |
| `player.in_match()` | True while a Zombies match with a local player is running. |
| `player.name_hash()` | The player's name hash (Entity_GetNameHash of its entity record): how scores, kills and events name the player. nil outside a match. |
| `player.health()` | The player's health and the most it can have, or nil outside a match. |
| `player.set_health(value, raise_max)` | Sets the player's health; raise_max also raises the most it can have to it. |
| `player.set_god(on)` | Makes the player take no damage (true) or normal damage again (the UnlimitedHealth cvar). |
| `player.god()` | True while the player takes no damage. |
| `player.position()` | The player's position {x, y, z} (game centimetres, y up: the camera, about 136 above the feet). |
| `player.teleport(position)` | Moves the player (a position like player.position()'s). |
| `player.stance()` | The stance name ("standing", "crouching", "prone", "downed"), or nil. |
| `player.set_stance(name)` | Sets the stance ("standing", "crouching" or "prone"; the camera height follows). |
| `player.downed()` | True while the player is down (last stand) and not dead. |
| `player.dead()` | True once the player died (the match is ending). |
| `player.kill()` | Kills the player (the game's KillPlayer). |
| `player.speed(name)` | A movement speed (one of player.SPEEDS) as the game reads it. |
| `player.set_speed(name, value)` | Sets a movement speed (one of player.SPEEDS; it applies at once). Returns the value kept. |
| `player.set_unlimited_stamina(on)` | Unlimited sprint (true) or the game's stamina again (the UnlimitedStamina cvar). |
| `player.unlimited_stamina()` | True while sprinting is unlimited. |
| `player.PERKS` | The perk names, in the game's order. |
| `player.perks()` | The perks the player owns, by name ({["Juggernog"] = true, ...}), or nil outside a match. |
| `player.give_perk(name)` | Gives a perk by name (with its effects, e.g. Juggernog's health). False if not possible. |
| `player.give_all_perks()` | Gives every perk the player is missing. Returns the names given, or nil outside a match. |
| `player.take_perk(name)` | Takes a perk away (as losing it when downed does: its icon goes, Juggernog's extra health too). False if the player does not have it. |
| `player.take_all_perks()` | Takes every perk away (the game's ResetAllPerks: icons and health back to normal). |

### boz.camera

The field of view and camera shakes.

```lua
camera.set_fov(90)                        kept across matches; aiming down sights still zooms
camera.fov()                              the field of view and the map's default
camera.shake("romero-transform-shake")    George's transform shake (every map: misc group)
camera.shake("explosion-large")           a Dead Ops shake (a map build bundles it by name)
camera.stop_shake()
```

The game's shakes (CCameraShakeConfig resources): romero-transform-shake (misc, so every map), explosion-large and explosion-lightning-bolt (Dead Ops). Fields: duration (ms, below 0: until stopped), strength, x/y/z offsets and rotation.

<details><summary>How it works</summary>

CCameraShake (singleton) plays one config at a time (CameraShake_Play(shake, name): +0x20 the config, +0x24 endless, +0x28 time left); each frame it picks offsets (+0x34 x y z, +0x40 roll) that CCameraShakeConfig describes.

</details>

| Function | Description |
| --- | --- |
| `camera.FOV_RANGE` | The range of field of view the game handles well (degrees). |
| `camera.shake(name)` | Shakes the camera with a shake config by name. Returns false when it is not loaded. |
| `camera.stop_shake()` | Stops the shake. |
| `camera.shaking()` | True while a shake plays. |
| `camera.fov()` | The field of view in degrees and the map's default, or nil outside a match. |
| `camera.set_fov(degrees)` | Sets the field of view in degrees (aiming down sights still zooms); nil restores the map's default. The value is kept across matches. Returns false outside a match (no player or no level). |

### boz.physics

Ray casts against the world and everything in it.

```lua
local hit = physics.raycast(from, to)          -- {position, normal, entity} or nil
physics.ground(position)                       -- the floor under a position (its y), or nil
physics.line_of_sight(a, b)                    -- true when nothing is between two points
```

Positions are {x, y, z} in game centimetres (y up). `filter` chooses what the ray can hit (collision groups as bits; default 0xffffffef: everything but triggers, like bullets).

<details><summary>How it works</summary>

Physics_RayCastAll(from, to, outList, filter, mask) casts through the Bullet world (CIsBulletWorld) and fills a list (STLport: the list object points at a sentinel node; nodes link next +0, previous +0x4). This is what `physics.raycast` wraps. 

</details>

| Function | Description |
| --- | --- |
| `physics.raycast_all(from, to, filter)` | Every hit of a ray from `from` to `to`, nearest first: `{position, normal, entity}` entries. |
| `physics.raycast(from, to, filter)` | Casts a ray from `from` to `to`. Returns `{position, normal, entity}` of the first hit, or nil. |
| `physics.ground(position, depth)` | The floor's height (y) under a position, looking down `depth` centimetres (default 2000). |
| `physics.line_of_sight(a, b)` | True when the world blocks nothing between two points. |

