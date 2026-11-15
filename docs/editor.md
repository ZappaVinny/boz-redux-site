# The editor

A tour of the BOZ Redux editor: what each part is for and where to find it. For the ideas behind
it, read [How a map works](how-a-map-works.md). For scripting, go to [Prefabs](prefabs.md).

The editor is Blender 5.2 LTS set up for making Zombies maps. It opens from the SDK app (**Open in
Editor** on a map project) and saves straight into the project. Everything is drawn the way the
game draws it, and **Build & Run** puts your map in the game in one click.

If you know Blender, it will feel familiar: G moves, R rotates, S scales, Tab enters Edit Mode.
One Blender unit is one game centimetre.

## The window

- **Top bar:** the **Project**, **Edit** and **Help** menus, the tabs, and **Build & Run** (with its
  ⚙ settings) on the right.
- **Viewport:** the map, with the game's shading.
- **Asset browser** (World tab, left): the game's objects to drag into the map.
- **Outliner:** every object. An object's name is its name in the game and in scripts.
- **Properties:** the Object tab's **Game** panel shows what the selected object is and its boxes.
- **Sidebar** (N in the viewport): the **BOZ** tab, **Problems**, and **Shipped files**.
- **Log** areas: the build's output and the game's `boz-log.txt`.

### The tabs

| Tab | What you do there | Guide |
| --- | --- | --- |
| **Game** | The map's rules: name, loading screen, rounds, special rounds, points, power-ups, the box | [Game rules](#game-rules) |
| **World** | Build the level | [Building the world](#building-the-world) |
| **Weapons** | Change, copy and import weapons; give them your own models and sounds | [Weapons](weapons-and-assets.md#weapons) |
| **Assets** | Import your own models and make game versions of them | [Your own models](weapons-and-assets.md#your-own-models) |
| **Effects** | Pick the game's effects and projectiles for your scripts | [Effects and projectiles](weapons-and-assets.md#effects-and-projectiles) |
| **Animation** | Change a weapon's animations | [Animations](weapons-and-assets.md#animations) |
| **Scripts** | Edit the map's Lua scripts | [Prefabs](prefabs.md) |
| **Audio** | Replace the game's sounds with your own | [Sounds](weapons-and-assets.md#sounds) |

**Characters** and **UI / HUD** are planned, and show what's coming.

### Menus

- **Project:** Save, Build & Run and its settings, **Import model…** (FBX, glTF and OBJ, scaled
  from metres), **Add game shape**, the **Prefab library**, **Check for problems**, **Open project
  folder**, and back to the SDK app.
- **Edit:** undo, redo, undo history, Blender's preferences.
- **Help:** these guides.

## Build & Run

**Project → Save** (Ctrl+S) saves the scene and the project's `source/` folder, which is what the
build reads.

**Build & Run** saves, builds the map into a mod, installs it into your client (last in the load
order, so its files win), and starts the game straight into your map. It won't start while the
game is already running.

The ⚙ next to it sets how the test starts: **Unlimited health**, **Unlimited points** and
**Starting points**. They only apply to the game Build & Run starts. The same dialog sets the map's
**base level**: the shipped level its rounds, zombie types, sounds and cameras come from. The
Developer mod is always on in a test, so its console (`` ` `` or F1) is at hand.

### Playing your map later

After the first Build & Run your map is a mod in the client. Press **PLAY** in the client's
launcher and it's in the list. **PLAY SOLO** starts it, and **CO-OP ROOM** joins or hosts a room for
that map. Players who install your packaged mod get the same choice.

## Problems

The **Problems** panel in the sidebar has two parts:

- **Warnings:** what looks wrong in the map right now, such as a zone no door opens, each with a
  button that selects the object.
- **Last build:** what the build said.

**Project → Check for problems** runs the checks by hand.

## Building the world

The **World** tab is where you build the level.

### The asset browser

| Group | What's in it |
| --- | --- |
| **Game prefabs** | Machines (perks, Pack-a-Punch, mystery box, power switch), Buying (wall buys), Doors (including **Debris**), Barricades (including **Window**), Defence (traps, trap switch), Teleporting (**Teleporter**, **Wormhole**) |
| **Level markers** | Spawns, Jump points, Sound |
| **Volumes** | Trigger, Hit, Use, [Lure point](#lure-points), and the map's [Zone](how-a-map-works.md#zones), [Sector](how-a-map-works.md#sectors) and Portal |
| **Models**, **Textures** | Everything from every map |
| **My prefabs**, **My assets** | Your own |

The editor builds the library from the SDK's asset library the first time (about 30 seconds) and
again after that changes.

### Building with shapes

Add → **Game shapes** (also the World header's **Shapes** button) adds blocks, walls, floors, ramps,
stairs and pillars at game size, with a tiling texture and the right settings. Blender's own Add →
Mesh shapes are 2 cm big here, since one unit is a centimetre, and the Problems panel flags
anything that small.

For detailed models (a statue, a gun) use the Assets tab, which makes a game version with the right
number of triangles ([Your own models](weapons-and-assets.md#your-own-models)).

### The In the game box

Every model and prefab has this box. The ideas are in
[What an object does in the game](how-a-map-works.md#what-an-object-does-in-the-game).

| Control | What it does |
| --- | --- |
| **Visible** | The master switch. Off: it starts hidden, and stops and blocks nothing. |
| **Walking** (models) | **Walk on it**, **Blocks** or **Walk through** |
| **Blocks walking** (game prefabs) | On: nobody can walk through it |
| **Stops bullets** | Shots hit it, or pass through |
| **Shape** | **Box** uses the model's bounds, **Mesh** its triangles |

Barricades don't stop bullets by default, and a trap always does (that's its kill volume).

A line under the switches says whether scripts can change the object during play: always when it
has a script, and whenever a script names it ([How a map works](how-a-map-works.md#what-an-object-does-in-the-game)).

### The Settings box

Every setting of the object: the game's own (cost, Needs power, ...) and your script's. See each
class on [Game prefabs](game-prefabs.md).

### The Script box

**New** asks for a name and a template (**Empty**, **Basic prefab** or **Object**), makes
`scripts/prefabs/<Name>.lua` and opens it in the **Scripts** tab. See
[Choosing a template](prefabs.md#choosing-a-template). **Pick…** uses a script you already have. The other buttons open it, **Reload** its settings and links, and remove
it. See [Prefabs](prefabs.md).

### The Links box

Links point objects at each other. Each link shows who it points to, with:

- **+** to search for an object;
- the select arrow, **Link selected**, to link what you have selected;
- **×** to remove one;
- **↺** to go back to the default.

Doors and Debris have **Opens zones** ([Zones](how-a-map-works.md#zones)), and a Teleporter has
**Destination** and **Stop over at**. Your script's `---@link` lines show here too. See
[Links](prefabs.md#links).

### Prefabs

**Make prefab** (Ctrl+G) groups the selected models, volumes and prefabs. **Ungroup** (Ctrl+Alt+G)
takes it apart. **Save as new prefab** stores it under **My prefabs**. Walkthrough:
[Make one in the editor](prefabs.md#make-one-in-the-editor).

### Game prefabs

- **Wall buy:** **Choose…** picks one of the project's weapons. The editor shows the weapon and its
  chalk drawing: the weapon's own, one drawn from its model, your image, or none.
- **Edit its model** gives a game prefab an editable copy of its mesh. It keeps its behaviour and
  the game draws your mesh. **Use the game's model** goes back.
- **Zombie spawn:** **Type** picks how they arrive.
- **Window:** a barricade and a spawn, ready for you to link.
- **Teleporter:** a Use volume that sends players to its **Destination**, by way of its **Stop over
  at**. Add any model as its pad. See [Teleporter](game-prefabs.md#teleporter).
- **Wormhole:** the game's wormhole as your own prefab: its tunnel models and effects, and a
  **Spot** for each player. Place it out of sight and use it as a Teleporter's stop-over. Every
  part can be moved, swapped or deleted. See [Wormhole](game-prefabs.md#wormhole).

### Textures

Properties → Material shows every texture slot with a preview:

- **Replace…** loads an image file.
- **From game…** uses any of the game's textures, with game shading.
- **✕** goes back to the default grid texture.

Game models need **Make editable** before their textures can change. Dropping a texture from the
asset browser onto an object gives it the same game-shaded material.

### Seeing what the game sees

The viewport's switches are at the left of the tool settings bar (also in the sidebar's BOZ
tab). They switch overlays:

- **Markers**;
- **Volumes**: your trigger, use, hit, sector, zone and portal volumes. Its arrow has a tick box
  for each kind, and **Shipped level** adds the shipped level's own trigger and collision shapes;
- **Links** between objects;
- **Walkable** and **Collision**, which build the map and show where people can walk (blue, orange
  where a door blocks it) and what bullets hit. **Refresh** builds them again after edits.

### Walkable areas

Players and zombies walk on the walkable area, so it's what to check when someone walks through a
wall or can't reach a room. Turn on **Show → Walkable**:

- **No blue where you want people:** the floor isn't **Walk on it**.
- **Blue through a wall:** the wall isn't **Blocks**.
- **Nothing changed after an edit:** press **Refresh**.

It needs the navmesh helper ([Installation](getting-started.md#the-navmesh-helper)). How it works
inside is in [Map internals](map-internals.md#navigation-meshes).

### Lure points

A **Lure point** is a volume zombies walk to while a script runs it, the way a monkey bomb pulls
them. Its settings are what `start()` does when the script gives no options:

| Setting | What it does |
| --- | --- |
| **Zombies** | How many it pulls, the nearest first (0: all). |
| **Reach (cm)** | Only zombies this close come (0: any distance). |
| **When they get there** | **Gather and wait**, or **Attack it** (scripts hear `hit` each time). |
| **Seconds** | How long it pulls once started (0: until a script stops it). |
| **Switched on** | Off: `start()` does nothing until a script switches it on. |

```lua
boz.get("Bait"):start()
```

Only walking zombies come (not hellhounds, monkeys or George), and they stop about 4.5 m away.
See the [lure recipe](prefabs.md#a-lure) and [Lure events](events.md#object-events).

### Remixing a shipped map

Maps made from **Kino der Toten**, **Call of the Dead**, **Ascension** or the **Tutorial** start as
the whole original map. Its objects are game prefabs you can move, rotate, scale, delete (X), copy
(Shift+D), change the settings of, or start hidden. Only what you changed is written into the map,
and **Put back as the level has it** undoes the changes to an object. The rooms stay as they are.

## Game rules

The **Game** tab sets a map's rules, in the order a player meets them: **Level**, **Rounds**,
**Special rounds**, **Zombies**, **Points**, **Power-ups** and **Mystery box**.

Every value starts as the base map's own, shown greyed. Change one and it's highlighted, with its
own reset button next to it to go back to the base map's. Only what you change is saved
(`source/game.json`). Problems, such as a speed mix that doesn't add up, show under the section
and in the Problems panel as you type.

### Level info

- **Name:** the map's name in the launcher and the mod list.
- **Loading screen:** a picture (PNG or JPG) shown while the map loads. It fills the screen at 4:3
  (1024 x 768); the "Loading" text and the tips are drawn over it. Pure magenta (255, 0, 255) shows
  as black.
- **Map picture:** the picture on your map's card on the launcher's **PLAY** screen. Choose a
  file, or **Capture the 3D view** to take one from the editor. Without one, the card shows the
  map's name.
- **Starting weapon:** set in the Weapons tab (shown here).
- **Power on at the start:** the power is on as soon as the map starts.
- **Special behaviour:** some of the game's code checks the map's name. Pick Kino, Ascension or Call of
  the Dead and the level manager's checks answer as that map: Kino's teleport start, Ascension's
  round effects, Call of the Dead's snow camera and start sound (the build brings what they
  play). Other code that compares names itself (Call of the Dead's zombies and Pack-a-Punch,
  Ascension's attack distances) stays with those maps.

### Rounds

The game has six **modes**: single player on easy, normal and hard, and co-op with 2, 3 or 4
players. The **Modes** table says which rounds each one plays:

| Column | What it does |
| --- | --- |
| **Rounds** | The base map's own rounds, or one of your round sets. |
| **Zombies x** | How many zombies, times this. |
| **Health x** | Their health, times this. |

So to make co-op harder, make a round set and pick it for the co-op rows, or just raise their
**Zombies x**.

A **round set** is a list of rounds. **New** makes one, as a copy of a mode's rounds (that mode then
plays it) or of another set. The base map's own rounds can be looked at but not changed: make a
round set to change them. **Played in** shows which modes use the set you're looking at.

Each row of the table is a round:

| Column | What it does |
| --- | --- |
| Zombies | how many zombies the round has |
| Health | each zombie's health (an easy game halves it) |
| At once | the most zombies alive at the same time |
| Spawn every s | seconds between spawns |
| Break after s | seconds from the round's end to the next round |
| Start delay s | seconds from the round's start to its first spawn |

Under the table, the selected round's **Speed mix** (walkers, fast walkers, runners, sprinters)
always adds up to 100%. **Advanced** holds powered zombies (extra zombies once the power is on,
like Kino's crawlers), the zombie type and the fog.

The last row is always **After that**: it plays again and again for every round past the list,
growing each time by **Growth each round** (zombies, at once, spawn time). Its **Health** follows
**The game's formula** (10 x round x round - 150; round 20 has 3850), times the mode's Health x, or
**Grows x per round** from the row's own health. **Add a round** and **Remove the round** change the
list; **After that** always stays last.

### Special rounds

Dog rounds (and Ascension's space monkeys) come between normal rounds. They belong to a round set,
and every mode that plays the set gets them. The game runs them in order: one plays its number of
times, then the next takes over. A special round comes after at least and at most a number of
normal rounds, with a chance each round in between, and its zombie count depends on the number of
players. **Add a special round** makes a dog round to start from; **Monkey round** is Ascension's
(it needs that map's perk machines and lander).

### Zombies

**Base zombie health**, **Zombies alive at most** (the limit for every round), and the zombie
**Looks**: a level has a few looks (a skeleton and body models), and zombies spawn with one of the
ticked ones, picked at random.

### Points

**Points at start**, **Points lost when down** (share of points), **Self revive** cost and
**Grenades per round**. **Points per action** sets the points for a hit, each kind of kill
(headshot, body, limb, knife, grenade), a barricade board, Carpenter and the Nuke, and the
barricade limit (at most this times the round number per round).

### Power-ups

**Which one drops:** a slider for each power-up, with the share of all drops it gets next to it
(0: never). **When they drop:** points and kills between drops, the drop chance per kill once a
drop is due, and drops per round. **For how long:** double points, insta-kill, fire sale and the
death machine.

### Mystery box

Its cost, the fire sale cost, and how many weapons it shows at least and at most when it spins. A
box given its own cost in the World tab keeps it. The weapons it gives are the Weapons tab's box
pool.

### Hook scripts

Hooks are in the **Scripts** tab's sidebar (**BOZ > Hooks**): every event a script can follow,
with **Create** and **Open**. See [How to catch one](events.md#how-to-catch-one).
