# Weapons, models, effects and sounds

The parts of a map that go beyond its level: the weapons players use, your own models, the
game's effects and projectiles, and sounds. Each has its own tab in
[the editor](editor.md), and all of them are saved in the map project and built into
the map's mod. The weapon field reference at the end of the weapons section lists every value
a weapon has.

## Weapons

The editor's **Weapons** tab changes the weapons of a map project: their damage, fire rate, ammo,
spread and the rest of the game's weapon data. You can also make new weapons from existing ones,
bring in weapons from other maps, give a weapon your own model, change its animations and sounds,
and add Lua for special behaviour. Changes are saved as you make them and applied when the map
builds. Your changes affect your map only; the game's other maps keep their weapons.

### The Weapons tab

- **The viewport** shows the selected weapon as the player sees it, through the game's eye,
  with the game's textures. The arms and the gun are one Blender armature with the game's
  skeletons (the gun under the arms' `TAG_WEAPON` bone, called "gun position"), and their models
  move with it the way the game skins them. The first-person view frames the gun exactly as the
  game does: the game's camera setting (50 unless you changed it) becomes a horizontal angle
  across a 16:9 screen the way its projection does it (about 71 degrees). **Field of view** takes
  the same number as the game's field of view setting: set it to what you play with.
- **Placement** (panel):
  - **First person** / **Free view**, **Arms** and **Bones** switch what the view shows.
  - **Position on screen** (or click the arms): G moves and R turns the arms and gun together in
    front of the camera; the arrow puts them back. It is the start of every animation, saved
    with the weapon (`"arms"` in its file) and built into all its arm animations.
  - **Model**: the stock gun or one of your assets (see [Your own model](#a-weapon-with-your-own-model)).
- **Animation** (panel) plays the weapon's animations: pick one, then Play, step a frame or to a
  change, Loop or drag the Frame slider. Change them in the Animation tab (see
  [Animations](#animations)); one you changed is marked "(edited)".

- **The list** shows the project's weapons. A map made from a whole shipped level lists its guns;
  an Empty or Debug map starts with the Colt alone. The list is what wall buys and the mystery
  box offer. Icons: a pencil for a changed weapon, a plus for a new one, an arrow for one from
  another map.
- **Import from game** adds a weapon: one of the map's own, or another map's (Call of the Dead's
  V-R11, Scavenger and Wunderwaffe DG-2, Ascension's matryoshka dolls and minigun, ...). An
  imported weapon brings its models, skins, skeleton, animations, animation state machines and
  projectile. Its sounds, effects and special behaviour belong to its own map and are not
  brought over: plain guns work, but a wonder weapon (V-R11, Wunderwaffe) crashes the game when
  it hits a zombie. Give a weapon special behaviour with a Lua script (**Add script**) instead.
- **New weapon** copies the selected weapon under a new name: same model and animations, your
  values.
- **Properties** lists every field, grouped. Each shows its unit; the **?** button explains it;
  the arrow resets a changed value. A `*` marks a meaning read from the shipped weapons that the
  game's code has not proven yet.
- **Pack-a-Punch result** picks the weapon an upgrade turns it into.
- **Starting weapon** (tick box): players start with this weapon instead of the Colt, with its
  **spare rounds** (the game's default is 40); they still get the knife and two grenades. Untick
  it to go back to the Colt. It applies to this map only: other maps keep the Colt.
- **Script** (optional) adds a Lua script for special behaviour: see below.

Wall buys pick from the project's list (World tab → the wall buy's **Choose…**); a mystery box's
**Weapon pool** (its settings → **Edit…**) picks which listed weapons it rolls.

Any weapon can fire a projectile instead of bullets, whatever its fire mode (automatic, shotgun,
single shot): in **Properties**, pick its **Projectile** (one of yours from the Effects tab, or one
of the game's) and tick **Fires its projectile**. The projectile flies at the weapon's **Launch
force**, or at its own speed when that is 0.

### A weapon with your own model

A weapon can show one of your **Weapon** assets (made in the Assets tab, see
[Your own models](#your-own-models)) instead of its stock gun. It keeps the rest of the gun it is made from:
the arms' animations, sounds and effects. Make a **New weapon** from a stock gun whose
animations suit your model (a big two-handed one: the Thundergun), then in its **Model** panel
pick your asset.

- **Its own skeleton:** the gun becomes your asset's bones (`tag_weapon`, `tag_clip`,
  `tag_flash`, ...) under a root at the origin like every stock gun's, so its parts sit where they belong. The stock gun's animations are moved
  onto them: each of your bones moves the way a stock bone does (the list under **Original motion
  of your bones comes from**:
  `tag_clip` follows the gun's magazine bone, `J_Clip` or `tag_clip`, else the bone its reload
  moves most; `tag_flash` its muzzle; everything else the root). Change any of them in the list.
- **Your model comes in as you made it:** its own size and origin, nothing resized. Place it with
  **Fit model in hand** (or click your model): it shows a copy on the gun position to move (G),
  turn (R) and scale (S); turn it off to keep the fit. **Show stock gun** draws the stock gun as a
  wireframe to line yours up against. **Auto fit** sizes and lines your model up with the stock
  gun only when you click it: its barrel (`tag_weapon` to `tag_flash`) along the stock gun's,
  upright, as long as it and centred on it. **Position**, **Rotation** and **Scale** change the
  fit by number (in the stock gun's model units).
- **Known issue:** in the game, your model is drawn bigger than the editor shows it. Check it in
  the game after placing it.

The build writes your model and its skin on its own skeleton, its textures and materials, the
lighter models the game shows while aiming down the sights (on guns that have one) and at a
distance (three levels, made with the asset; an asset made before these existed uses its full
model for them: make it again), every animation of the gun on its skeleton, and the gun's state
machine (a copy of the stock one: same timing, transitions and events) pointing at them.

### Animations

The **Animation** tab changes the selected weapon's animations, one at a time. Its small view is
the game's eye, its big view is free to work in, and the rig is ready to pose: click a bone, R
turns it, G moves it. Grab **gun position** to move the gun (the hands come with it: each arm
reaches its grip with IK) and **hand L** / **hand R** to change a grip.

**Your changes sit on top of the original.** The game's animation plays underneath, locked, and
what you key is added to it. So you never redo an animation frame by frame: move a hand on one
frame and key it, and the whole animation follows, blending from the original into your change
and back between your keys. Where you have no keys, the original plays.

- **Auto-key is on:** moving a bone keys it on the frame shown.
- **Key pose** keys every bone you moved on this frame, whatever is selected, so a change is
  never lost because the wrong bone was selected.
- **Clear keys here** takes your keys off the frame shown; **Reset this animation** throws every
  change to it away.
- **Play**, the step arrows and the Frame slider move through it; **Length** sets the last frame
  (30 frames a second).
- **Save animation** stores it (it is also stored when you save, switch animations or leave the
  tab).

**New clip** (+) adds an animation the game doesn't have, such as a charge or an inspect. It
starts as the idle pose; key it the same way. **Remove clip** (-) deletes one of yours. Scripts
play a clip with `weapon:play(name)`, or play it instead of one of the game's with
`boz.weapons.replace_animation` ([boz.weapons](scripting.md#bozweapons)). A clip ends back at idle
after its length.

Animations are stored in the project (`source/weapons/anims/<weapon>/`: your keys to edit again,
and the result at every frame with the IK worked out, which the build uses; extra clips are
listed in `extra.clips`). The build writes your arms animations into a copy of the weapon's arms
state machine and the gun's into its gun state machine, so only that weapon changes. The state
machines keep their timing and events (when a reload refills the magazine, for example): an
animation much longer or shorter than the stock one still has its events at the stock times. A
new clip becomes a new state of the weapon's state machines.

#### Charged shots

`boz.charge` turns a weapon into one you hold to charge and release to fire, with a stronger
projectile the longer you hold. The game still fires each shot, so ammo, recoil and co-op work as
usual.

```lua
boz.charge("ice_rifle", {
    levels = {{projectile = "ice_bolt"}, {after = 1.2, projectile = "ice_blast", ammo = 3}},
    effect = "frost", bone = "tag_flash",      -- glows on the muzzle while charging
    clip = "charge",                           -- a clip you added in the Animation tab
    max = 3,                                   -- fires by itself after 3 seconds
})
```

A tap fires the first level. With a `clip`, the shot waits 0.4 seconds after the clip stops,
which the weapon needs before it can fire.

### Weapon scripts

A weapon script is a class, like a [prefab's](prefabs.md#the-shape-of-a-script): it extends
`boz.Weapon`, and `self` is the weapon.

```lua
-- weapons/mp40_heavy.lua
local Heavy = boz.Weapon:extend("Heavy")

function Heavy:on_fire(data)    -- every shot (data.clip: rounds before it)
    self.shots = (self.shots or 0) + 1     -- saved with the game, like any field
    if self.shots % 10 == 0 then
        self:set_ammo(nil, self:reserve() + 5)
    end
end

function Heavy:on_equip() end   -- taken in hand
function Heavy:on_given() end   -- bought, rolled from the box, or given by a script
function Heavy:on_reload() end  -- a reload started

return Heavy
```

Hooks and methods are listed under [Weapon](game-prefabs.md#weapon). Script changes last for the
match; the Weapons tab changes a weapon for good. Any other script can follow weapons with the
`weapon_*` [game events](events.md#weapons), and use `boz.weapons` to give, take and upgrade them.

### Weapon project files

The weapon list is `source/weapons/index.json`; each changed, new or imported weapon has its own
`source/weapons/<name>.json`:

```json
{"name": "mp40_heavy", "base": "mp40", "level": "", "fields": {"m_clipSize": 50,
 "m_damage.m_headDamage": 900, "Upgrade": "Afterburner"}, "script": "weapons/mp40_heavy.lua"}
```

`base` is the weapon it is made from (empty: itself), `level` the map it is imported from (empty:
this map's own), `display` its **In-game name** (Properties). The game names weapons in its
prompts from its own text: a wall buy asks for the string id `<weapon>_S_WEAPON`
(CIngameStatePlaying::UpdatePoiPrompt hashes the weapon's name on with `_S_WEAPON`). A new
weapon has no entry there, so the prompt shows ">>Unknown Hash<<" until you give it an in-game
name; the map adds that text (`boz.text`) when the level starts. Empty keeps the game's own name.
`sounds` maps sound fields to the weapon's own sounds (`{"reloadSoundSequence": "my_reload"}`,
the Audio tab's saved sounds): the build gives the field a sound of the weapon's own and points
the field at it ([Sounds](#a-weapons-own-sounds)).

### How weapons work

Each map has a weapons group (`ingame/weapons/weapons_<map>`): one entity per weapon with a
`CPlayerWeapon` component, plus the weapon's models, skins, skeleton, animations and two animation
state machines (the arms' and the gun's; the arms' live in `arms_<map>`). The fire mode is a
class the game makes from **Fire mode** (`CPlayerWeapon::CreateBehaviour`): automatic modes fire
at **Fire rate**; single-shot weapons fire as fast as their fire animation plays, and a reload
lasts as long as its animation (the bullet and the end of a reload are events in the animations),
so those two come with the animation tools, not this form.

### Field reference

*Likely (from the shipped weapons)* marks a meaning worked out from the values the game's own
weapons use but not yet proven in the game's code (the `*` in the editor's Properties list, and
the `likely` confidence level of the [game definition](contributing.md#conventions)).

<!-- fields:start -->
#### Firing fields

| Field | Key | Unit | Default | What it does |
| --- | --- | --- | --- | --- |
| Fire mode | `behaviour` |  | Single shot | How the weapon fires (CPlayerWeapon::CreateBehaviour). Automatic, Automatic shotgun and Death Machine keep firing while the trigger is held. Values: 0 Melee / no gun, 1 Single shot, 2 Automatic, 3 Burst, 4 Shotgun, 5 Automatic shotgun, 6 Revolver, 7 Grenade, 8 Special grenade, 9 Launcher, 10 Death Machine, 11 Claymore, 12 Monkey bomb, 15 Thundergun, 16 V-R11, 17 Wunderwaffe. |
| Fire rate | `autoROF` | rounds/min | 0 | Automatic modes only (MP40 535, AK-74u 750). Single-shot weapons fire as fast as their fire animation plays. |
| Burst size | `semiBurst` | rounds | 0 | Rounds per trigger pull (Burst). *Likely (from the shipped weapons).* |
| Fires only when aiming | `requiresADS` |  | False | The trigger does nothing unless the player aims down sights. |
| Aim assist | `autoAim` |  | True | The crosshair is pulled toward zombies. *Likely (from the shipped weapons).* |
| Recoil | `recoil` |  | None | How much the view kicks per shot. Values: 0 None, 1 Light, 2 Medium, 3 Heavy. *Likely (from the shipped weapons).* |
| Muzzle flash | `muzzleFlash` |  | 0 | The muzzle flash effect. |

#### Ammo fields

| Field | Key | Unit | Default | What it does |
| --- | --- | --- | --- | --- |
| Clip | `m_clipSize` | rounds | 0 | Rounds in one magazine. |
| Reserve | `m_ammoSize` | rounds | 0 | Spare rounds carried besides the clip (Colt: 8 + 80). |
| Reloads one at a time | `loopedReload` |  | False | Rounds go in one by one and the reload can be cut short (pump shotguns). |
| Two shells per step | `doubleShellReload` |  | False | A looped reload loads two shells each step. *Likely (from the shipped weapons).* |
| Taped magazines | `flipClipReload` |  | False | Every other reload uses the second (flipped) magazine animation. |
| Ammo pickup when empty | `lightningBoltPickup` |  | False | When the weapon runs dry the pickup manager is told (shipped weapons leave it off). *Likely (from the shipped weapons).* |

#### Damage fields

| Field | Key | Unit | Default | What it does |
| --- | --- | --- | --- | --- |
| Head | `m_damage.m_headDamage` | points | 0 | Damage of a hit to the head (MP40 400). |
| Torso | `m_damage.m_torsoDamage` | points | 0 | Damage of a hit to the body (MP40 100). |
| Limbs | `m_damage.m_limbDamage` | points | 0 | Damage of a hit to an arm or leg (MP40 100). |
| Falloff starts | `m_falloff.m_startDistance` | cm | 0 | Full damage up to this distance (shotguns 400, Thundergun 1200). |
| Falloff ends | `m_falloff.m_endDistance` | cm | 0 | Distance where damage reaches the falloff damage (shotguns 800). |
| Falloff damage | `m_falloff.m_damageMod` | % | 0 | Damage left at the end distance (shotguns 50). *Likely (from the shipped weapons).* |
| Penetration | `m_penetration.m_penetrationRating` |  | 1 | How far bullets go through zombies and thin surfaces (rifles 10, shotguns 15). *Likely (from the shipped weapons).* |
| Penetration loss | `m_penetration.m_damageFalloff` | % | 0.0 | Damage lost each time a bullet goes through something (30 to 50). *Likely (from the shipped weapons).* |
| Penetration minimum | `m_penetration.m_damageMin` | points | 0 | Damage never drops below this after going through things. *Likely (from the shipped weapons).* |
| Fire rounds | `incendiaryRounds` |  | False | Hits set zombies on fire (Hades, the upgraded Olympia). *Likely (from the shipped weapons).* |
| Melee range | `m_meleeRange` | m | 0.0 | Reach of a melee weapon (knives 1.5). *Likely (from the shipped weapons).* |

#### Accuracy fields

| Field | Key | Unit | Default | What it does |
| --- | --- | --- | --- | --- |
| Spread, steady | `m_accuracy.m_spreadMin` |  | 0.0 | Bullet spread when still and not firing (crosshair size; Colt 0.28). |
| Spread, moving | `m_accuracy.m_spreadMax` |  | 1.0 | Bullet spread at its widest, while moving or firing (Colt 0.525). |
| Crouched | `m_accuracy.m_modCrouched` | x | 1.0 | Spread multiplier while crouched (0.85: 15% tighter). |
| Prone | `m_accuracy.m_modProne` | x | 1.0 | Spread multiplier while prone. |
| Crosshair | `m_accuracy.m_crosshairType` |  | Standard | The crosshair drawn for this weapon. Values: 0 None, 1 Standard, 2 Launcher, 3 Minigun, 4 Thundergun. |

#### Aiming fields

| Field | Key | Unit | Default | What it does |
| --- | --- | --- | --- | --- |
| Aiming field of view | `m_ADSFoV` | degrees | 0.0 | Field of view while aiming down sights (MP40 40, AK-74u 30); 0 keeps the normal view. |

#### Projectile fields

| Field | Key | Unit | Default | What it does |
| --- | --- | --- | --- | --- |
| Projectile | `m_projectileName` |  | 0 | What a launcher or grenade throws: one of yours from the Effects tab, or the game's. |
| Fires its projectile | `boz_fires_projectile` |  | off | Every shot launches the projectile instead of bullets, whatever the fire mode. Set by BOZ Redux, not the game. |
| Launch force | `m_projectileLaunchForce` |  | 0.0 | Speed the projectile leaves with (Thundergun 3000). *Likely (from the shipped weapons).* |

#### Pack-a-Punch fields

| Field | Key | Unit | Default | What it does |
| --- | --- | --- | --- | --- |
| Pack-a-Punch result | `Upgrade` |  | 0 | The weapon Pack-a-Punch turns this one into (none: it cannot be upgraded). |
| Pack-a-Punch sound | `m_playPAPSound` |  | False | Plays the upgraded-weapon sound when fired. *Likely (from the shipped weapons).* |
| Once per game | `isUnique` |  | False | The mystery box gives it only once (Thundergun). *Likely (from the shipped weapons).* |
| Weak weapon | `crappyWeapon` |  | False | Marked as a poor weapon (set on the CZ75 only). *Likely (from the shipped weapons).* |

#### HUD fields

| Field | Key | Unit | Default | What it does |
| --- | --- | --- | --- | --- |
| Ammo icon | `ammoIcon` |  | None | The ammo symbol on the HUD. Values: 0 None, 1 Rifle, 3 Shotgun shells, 4 Grenade launcher, 8 Belt / large, 9 Pistol, 10 Grenade, 11 Claymore, 12 Monkey bomb. |

#### Sounds fields

| Field | Key | Unit | Default | What it does |
| --- | --- | --- | --- | --- |
| Fire | `fireSoundSequence` |  | 0 | Played on every shot. |
| Last round | `m_fireLastBulletSoundSequence` |  | 0 | Played on the last round of a clip. |
| Empty click | `fireEmptySound` |  | 0 | Firing with no ammo. |
| Reload | `reloadSoundSequence` |  | 0 | A full reload. |
| Reload (rounds left) | `reloadPartialSequence` |  | 0 | A reload with rounds still in the clip. |
| Equip / pickup | `buySound` |  | 0 | Played on equip, including after a wall purchase; also plays on weapon switches. |
| Bought (player) | `playerBuySound` |  | 0 | The buyer's own purchase sound. |

<!-- fields:end -->

## Your own models

The **Assets** tab brings your own models into the game at the game's level of detail. You
import a high-quality model, and the editor makes a game version of it: a few thousand triangles
at most and small textures, the way the game's own models are made. You then place the game
version in a map, or give a weapon your model ([Weapons](#a-weapon-with-your-own-model)).

### Importing

**Import…** takes a `.blend`, `.fbx`, `.glb`/`.gltf` or `.obj` file, or several at once;
**Import a folder…** takes every model in a folder and its subfolders. Each becomes an asset named
after its file, and they're made one after another ("N more waiting"); a file that fails is listed
under the asset list without stopping the rest. Choose:

- **Kind:** **Prop** (a model to place in maps) or **Weapon** (a gun: its armature, bones and
  bone weights are kept, and its parts are found from the bones).
- **Preset:** how detailed the game version is.

| Preset | Weapon | Prop |
| --- | --- | --- |
| **Stock** (like the game's own) | 1,500 triangles, textures up to 512 | 800 triangles, textures up to 256 |
| **PC** (sharper) | 4,000 triangles, textures up to 1024 | 2,500 triangles, textures up to 512 |

For comparison, the game's guns have about 1,000 to 1,300 triangles and 256 to 512 textures. A
busy model (lots of thin spikes, tentacles, teeth) keeps its shape much better on PC; import a
gun as a Weapon, since a Prop's budget is about half.

The file is copied into the project (`assets/<name>/`), with the files it links to (textures next
to it, an `.obj`'s `.mtl`, a `.gltf`'s `.bin`), keeping their folders, so a `.blend` that points to
`_images/` still finds its textures. A texture missing later is looked for by name in the asset's
folder and next to the original file. The original's location is remembered,
so **Refresh from source** picks up later changes to it (for example a magazine added to the
gun). The game version is made straight away.

### Making the game version

**Make game version** runs in the background (the editor stays usable; progress shows in the
Log). It:

1. Loads the model's meshes (from a `.blend`: all its meshes, with their armatures). The
   armature with the most bones is the model's; another armature that shares a bone name with it
   (a magazine with its own `tag_clip`, as ripped attachments come) is snapped so that bone lines
   up with the model's, the way the game attaches parts, wherever it sits in the file.
2. Works out the size: the **Source unit** (centimetres, metres, inches, millimetres) is guessed
   from the model's length (a weapon 30 to 200 cm, a prop 10 to 600 cm) unless you set it.
3. Reduces every mesh to its share of the triangle budget (bigger meshes get more; small parts
   such as eyes keep at least a few dozen triangles). Each mesh is welded first, so it reduces as
   one surface without cracks; afterwards every triangle reads its texture coordinates back from
   the original surface, from the texture island under its centre, so no triangle smears the
   texture across a seam. Bone weights are kept.
4. Makes one texture per material: the colour image reduced to a power of two, the biggest
   surfaces getting the preset's size and smaller ones less (about the same detail per
   centimetre everywhere). The game has no normal maps, so with **Bake normal map** on the normal
   map's detail is shaded into the colour (lit from above and in front). Two-channel normal maps
   (Call of Duty's, with an empty blue channel) work too. The game has no glow and no shine
   either: a glowing material's emission texture is added onto its colour, and a material whose
   metal lives in a specular colour map (Call of Duty's `_s` maps on **Specular Tint**) gets that
   colour blended in, so it isn't left dark. With no image on **Base Color**, the colour map is
   picked by name (not a `_n`, `_g`, `_s`, `_o` or `_e` map). A material without an image gets a
   small texture of its colour.

5. Closes what reducing opened, so nothing is see-through: reducing rounds corners off and lets
   the borders of the model's open shells (parts tucked into each other) creep back, which opens
   gaps. The reduced surface is pushed out gently to cover the original, and every open border
   grows back a little so neighbouring shells overlap again. Then the game version is drawn as
   the game draws it (one side) from six directions against the original: if anything is
   see-through, it is made again from the original with more triangles (up to five times). Game
   checks says when it needed more triangles than your budget; a model this busy at the Stock
   preset may need two or three times as many.

**Own budget** sets the triangle count yourself; **Textures** caps the texture size. A game model
holds at most 10,917 vertices: a model that would need more is made with fewer triangles.

### The view

The tab has its own scene: the map is never touched. The viewport header switches between
**High quality**, **Game** and **Side by side**. The game version is drawn the way the game draws
it (the texture only, no lighting). The image editor shows its textures.

The game version is an ordinary mesh: you can touch it up by hand and **Save edits** keeps your
changes (bone weights follow the nearest original vertex). Making it again asks first, because
it replaces your edits.

### Game checks

**Game checks** lists the game version's triangles, vertices, textures (and their memory), size
and bones, then:

- **Problems** (they stop the map from building): more than 65,535 vertices, a model more than
  3.2 m from its centre (usually the wrong unit), texture coordinates past -8..8, texture sides
  that are not powers of two from 4 to 1024, a vertex following more than 4 bones.
- **Warnings**: over the triangle budget, textures over the preset, and for weapons a missing
  part (the magazine, `tag_clip`: the reload would show none).

Where there is a one-click fix (reduce the budget, halve the textures, use centimetres), a
**Fix** button sits next to it.

### Using an asset

**Place in map** puts a copy at the 3D cursor in the World tab; **Add → My assets** and the
palette's **My assets** catalog (drag it in) do the same. A placed asset is a model like any
other (collision, start state, scripts, prefabs) that refers to the asset: making the asset
again updates every copy. An asset placed in the map cannot be removed until its copies are
deleted.

The game version is stored in tenths of a centimetre (the game's positions are 16-bit
integers, so this keeps small details) and placed at 0.1 scale, the way the game itself places
some of its models.

### Model project files

```text
assets/<name>/<file>              the source file (a copy)
source/assets/<name>.json         settings: kind, preset, budget, texture size, unit, ...
source/assets/<name>/model.json   the game version: vertices, uvs, triangles, materials;
                                  weapons also bones, bone weights and parts
source/assets/<name>/textures/    one PNG per material
source/assets/<name>/stats.json   the figures and checks shown in the tab
```

`bozkit.assets` reads and writes these; `blender/boz_suite/asset_build.py` makes the game version.
Third-party models (ripped game models and the like) belong in your project only: do not
publish them.

## Effects and projectiles

Make your own particle effects and projectiles, or use the game's: black holes, explosions,
lightning, monkey bombs. Scripts spawn them anywhere, attach them to objects and guns, and change
them while they play.

### The Effects tab

The tab has two lists, **Effects** and **Projectiles**. Both hold your own and the game's:

- **+** makes a new one of your own.
- **Add from the game…** searches everything the game can spawn (by name, map or behaviour) and
  adds it to the list as it is. It works on any map: the build brings it with everything it needs
  (models, materials, textures, and the sounds its code plays), from whichever map it comes from.
  A game projectile has two switches: **Hide its model** (a black hole without the Gersch device
  lying on the floor) and **Stays where spawned** (no physics: it stays exactly where a script
  spawns it).
- **Make editable** turns a game effect into one of yours: a copy of all its values, with its
  textures saved as PNG files you can change.
- **Name** is what scripts call it. **Copy script line** copies a line of Lua that spawns the
  selected one where the player aims.

Scripts can also spawn any of the game's effects by its own name or `"0x..."` hash without adding
it: the build finds those in the scripts.

### Making an effect

An effect is one or more **emitters**, and each emitter makes particles. **Kind**: **Lasting**
keeps going until it's removed, **Burst** plays once (an impact). **Scale** makes the whole effect
bigger or smaller. **Make a script** gives it a [script](#scripts-for-effects-and-projectiles).

Each emitter has these groups:

| Group | What's in it |
| --- | --- |
| **Look** | **Picture** (a PNG), **Pictures** and **Across** for a flipbook (a grid of frames, played in order), **Blend**: **Glow (add)** for fire, sparks and magic, or **Solid (blend)** for smoke and dust, and a **Tint**. |
| **Making particles** | **Time between particles**, and whether it **Keeps making particles** or stops after a time. |
| **Size and turning** | **Size when made**, **Size x**, **Grows**, **Spin**, **Start angle**. |
| **Where they start and how they move** | **Start at** and a **Random extra** around it, **Speed** and its random extra, **Pulled** (gravity: negative y falls, positive y rises). |
| **More** | **Fade out as they age**, **Trail** (spawn along the path the effect moves), **Face the camera**, **Stand upright**, **Start a little along their path**, and what space the particles live in. |

Values that vary come in pairs, such as **Shortest** and **Longest** for **How long each one
lives**: each particle gets a random value between the two. Positions are in centimetres with y
up, speeds in centimetres a second, times in seconds or milliseconds as the field says. Hover over
any field for what it does.

### The preview

The tab's right side is a 3D view that plays the selected effect, yours or the game's, at one
spot on a floor with two walls marked every 50 cm, so you can judge its size. The view's header
has its controls: play and pause, restart, **Speed**, loop, **moving** (the effect circles, to see
trails) and **in the map** (play it at the 3D cursor in your map instead of the room). The preview
updates as you change values.

### Projectiles

A projectile of your own starts **blank**: it flies and does nothing else until you give it
pieces or a script.

**How it flies:** **Speed**, **Falls** (gravity: it arcs like a grenade), **Lasts** (seconds, then
it's gone), and an **Enter/leave radius** for its script's `on_enter` and `on_leave`.

**Pieces** are ready-made behaviour you tick on:

| Piece | What it does |
| --- | --- |
| **Blast where it hits** | Damage around the hit: **Damage** at the centre and at the edge, full damage within a radius, nothing beyond **Reaches**. The kills are the player's. |
| **Lure zombies where it lands** | Zombies go there for a number of seconds, like a monkey bomb. |
| **Black hole where it lands** | The Gersch device's black hole opens there. |
| **Effect where it hits** | One of your effects, or a game one, at the hit. |
| **Effect riding along** | One of your effects follows it in flight. |
| **Ribbon behind it** | A streak behind it: a picture, width, colour and how fast it fades. |

**+** offers presets to start from: **Blank**, **Ray Gun bolt** (blast and ribbon), **Lure** and
**Black hole**.

Any weapon can fire your projectile: see [The Weapons tab](#the-weapons-tab). Scripts launch it
with `boz.effects.projectile`.

### Effect pieces

Your effects have pieces too, under **Where it appears**: **Blast**, **Lure zombies to it** and
**Black hole** happen where the effect spawns. That includes an effect used as a projectile's
impact or one riding along with it, so an impact effect can lure.

### Scripts for effects and projectiles

**Make a script** on a projectile or an effect writes its script
(`scripts/projectiles/<name>.lua` or `scripts/effects/<name>.lua`). Each copy in flight runs its
own.

```lua
local IceBolt = boz.Projectile:extend("IceBolt")

function IceBolt:on_launch(shooter)
    self:attach("frost")                       -- an effect rides along
end

function IceBolt:on_hit(hit)                   -- hit.kind: "zombie", "player" or "world"
    if hit.kind == "zombie" then
        hit.zombie:freeze()
        return false                           -- no pieces: it flies on through
    end
end

function IceBolt:on_enter(what)                -- what.kind: "zombie" or "player"
    if what.kind == "zombie" then what.zombie:damage(50) end
end

return IceBolt
```

A projectile's hooks: `on_launch(shooter)`, `on_update(dt)` (every frame it flies),
`on_hit(hit)` (`kind`, `zombie`, `position`), `on_enter(what)` and `on_leave(what)` (something
comes within or leaves its **Enter/leave radius**), `on_end()` (it hit, timed out or was
removed). Returning `false` from `on_hit` skips its pieces and lets it fly on; from `on_launch`
it skips its trail. Its methods: `position()`, `velocity()`, `set_velocity({x, y, z})` (steering,
homing), `attach(effect)`, `explode(options)`, `lure(options)`, `remove()`.

An effect's script extends `boz.Effect`: `on_spawn()` (returning `false` skips its pieces),
`on_update(dt)`, `on_end()`, with `self.effect` (the effect: `set`, `emitters`, `position`,
`remove`), `lure(options)` and `explode(options)`.

### boz.effects

```lua
local boz = require("boz")
local effects = boz.effects

-- A one-off effect, removed after two seconds.
effects.spawn("impactRayGun", effects.aim(), {lifetime = 2})

-- One of yours on the gun's muzzle while it charges.
local glow = effects.attach("frost", "weapon", {bone = "tag_flash"})
glow:set({scale = 2, rate = {5, 5}})

-- A black hole where the player aims, for six seconds, its swirl at chest height.
local hole = effects.projectile("gersch", effects.aim(), {trigger = "open", lifetime = 6, raise = 200})
hole:remove()               -- or close it early (with its own sound)
```

- `effects.spawn(name, position, options)`: an effect at `{x, y, z}` (game centimetres, y up).
  Options: `rotation` `{x, y, z, w}`, `lifetime` (seconds, then it is removed).
- `effects.attach(name or effect, target, options)`: an effect that follows a target: an object
  (`boz.get(...)`), an entity, or `"weapon"` (the gun in hand). Options: `bone` (a bone of an
  animated target, such as `"tag_flash"`), `offset`, `lifetime`. `effects.detach(effect)` leaves
  it where it is.
- `effect:set(settings)`: changes an effect while it plays: `scale`, `rate = {min, max}`
  (particles a second), `velocity`, `spread`, `position`, `position_spread`, `duration`,
  `spawning` (false stops new particles). `effect:emitters()` lists its emitters.
- `effects.projectile(name, position, options)`: a projectile the game runs. Options: `trigger`
  (`"open"`), `lifetime` (seconds), `raise` (centimetres: it floats that far above the position;
  for one that **Stays where spawned**), `hidden` (its own model is not drawn: a black hole
  without the device lying on the floor), `freeze` (stay where spawned instead of settling on the
  floor), `lift` (centimetres up, default 10, so it does not start in the floor; `raise` replaces
  it), `rotation`. It is the
  player's (zombies turning to a device ask for its owner, so it always has one). The game sets a new projectile up a frame after it spawns; the trigger, lifetime and
  hiding are applied then (`:ready()` says when), so scripts need not wait.
- `effects.explode(position, options)`: an explosion: `radius`, `inner`, `damage`, `min_damage`.
- `effects.aim()`: the point the player's crosshair is on (where a shot lands, up to 100 m) and
  whether it is a live zombie.
- What they return: `:alive()`, `:ready()`, `:position()`, `:move(position)`,
  `:trigger(name)`, `:hide()`, `:show()`, `:freeze()`, `:lifetime(seconds)`, `:remove()`.

Names are the Effects tab's names, or the game's own names (`"gersch_Effect"`, `"impactRayGun"`,
`"iceShatter"`, ...), or `"0x..."` hashes; the build bundles every one a script names.

#### What projectiles do

| Behaviour | What it does | Triggers |
| --- | --- | --- |
| Thrown (lifetime) | Grenades: explode after their time | `explode` |
| Bolt | Ray gun, launchers: explode where they hit | `explode` |
| Lure | Monkey bomb: zombies are drawn to it | |
| Black hole | Gersch device: zombies within 50 m walk into it and die within 1.5 m; a player inside is sent to one of the map's Gersch teleport points (a map without them: nothing happens) | `open` |

A black hole's swirl draws about a metre below the device (the device normally lies on the floor
and the swirl model is built downwards from it), so a hole spawned on the floor shows its centre
under the floor: `raise = 200` puts the ball at chest height. A raised black hole kills just as
far around it on the floor: its kill reach grows with the height, so zombies walking under it
still die.

A black hole normally opens once it has come to rest and lasts 8 seconds; `trigger = "open"`
opens it at once and `lifetime` sets how long it stays open.

The game kills the zombies a black hole takes without naming who killed them, so they do not
count as the player's kills (stats, achievements). A script that wants them counted asks once:
`require("boz.game.zombies").credit_kills("SUBJECT_ZOMBIE_GERSCH_DEATH")`. The Effects tab's **Copy
script line** adds that line for a black hole.

### Example: a gun that opens a black hole where it fires

This example makes `idgun`, a new weapon copied from the Thundergun (**New weapon** in the
Weapons tab), whose shots open black holes. In the Effects tab, name Ascension's
`bh_bomb projectile` `gersch` and tick **Hide its model** and **Stays where spawned**. In the
Weapons tab, set `idgun`'s **Fire mode** to **Single shot** (a Thundergun-based weapon would otherwise still fire its
own blast; the Thundergun's bullets do no damage, so the black hole does the killing), and give it
a script (**Add script**):

```lua
local IdGun = boz.Weapon:extend("IdGun")

require("boz.game.zombies").credit_kills("SUBJECT_ZOMBIE_GERSCH_DEATH")   -- its kills are the player's

-- Every shot: a black hole where the shot lands, for six seconds.
function IdGun:on_fire(data)
    local where = boz.effects.aim()
    if where then
        boz.effects.projectile("gersch", where, {trigger = "open", lifetime = 6, raise = 200})
    end
end

return IdGun
```

### How effects work

From the game's code (Ghidra names in the game definition): `Spawn_ByHash(CSpawnManager, spec
hash, position, rotation)` creates any entity spec a loaded group holds (`Entity_CreateFromSpec`,
then the `CIsTransform`'s position +0xa8 and rotation +0x98, stored scalar first: s x y z). A projectile is an entity
with a `CProjectileEntity` whose `behaviourType` (1 thrown, 2 bolt, 4 lure, 6 Gersch device)
decides what `Projectile_UpdateFlight`, `Projectile_UpdateGersch` and `Projectile_Impact` do; it
keeps its lifetime (ms) at +0xc0, its open state at +0xc7 and its owner at +0x88, and takes events
on its subject at +0x28. A Gersch device that receives `SUBJECT_SPAWN_GERSCH_EFFECT` spawns
`gersch_Effect` (shared), plays `gersch_opens` and loops `gersch_loop` (Ascension's sounds), and
counts its lifetime down to `SUBJECT_TERMINATE` (removes the effect, plays `gersch_shuts`). Zombies
(`CAIControllerZombie`) ask `ProjectileManager_FindNearest` for an open device within 5000 units,
walk into it, and die (`SUBJECT_ZOMBIE_GERSCH_DEATH`) within `m_proximityRadius` x 100 (the
projectile's +0x90, metres, measured in 3D from its centre: `raise` widens it to
sqrt(r² + raise²)). The swirl (`gersch_Effect`, a billboard model) spawns at the device's
position and rotation and draws from 22 to 205 units below it.
`WeaponManager_UpdateAim` ray-casts the crosshair every frame into the weapon manager's +0xcc.

Your own effects and projectiles are written into the map's projectiles group by
`bozkit/fx.py`: each effect is an entity spec with your emitters (`CIwGFXEmitterSpec`, decoded in
`bozkit/gfx.py`) and their materials and textures; each projectile is the Ray Gun bolt's spec
without its explosion and smoke trail, with your speed and lifetime (and a physics body when it
falls). The standard library takes over its impact (`Projectile_Impact`) and runs its pieces and
script. The project file is `source/fx.json`.

The catalog is `bozkit/effects.py`, the bundling `bozkit/bundle.py`
([Asset formats](how-the-game-works.md#map-agnostic-assets-bozkitbundle)); the names are
`source/effects.json`.

## Sounds

The **Audio** tab replaces the game's sounds with your own. It has two parts:

- **Game sounds:** every sound your map plays, as slots you can hear and replace.
- **Your sounds:** the processor every sound goes through before it can be used: Import a
  recording, shape it, Preview it as the game will play it, then Save.

Only saved sounds go in slots. Changing a saved sound's settings asks you to Save again; the
slots using it play the new version from the next build.

Every saved sound is also built into the map under its own name, so scripts play it with
`boz.audio.play("my_sound")`. A name the game already uses
for one of its sounds stays the game's: importing a recording called `fire` names it
`imported_fire`, and a saved sound of yours with such a name plays as `imported_<name>`. Its
details in **Your sounds** say so.

### Game sounds

Pick **Show the sounds** the first time (it needs the asset library). The list shows each sound
with its length; **Show** filters it:

| Filter | What it shows |
| --- | --- |
| All | Every sound the map plays |
| Replaced | The slots you filled |
| Weapons | Fire, reload, empty click, buy sounds of every weapon |
| Shared | The game's shared sounds: weapons, zombies, power-ups, rounds, buying |
| This map | The base map's own sounds (its dogs, teleporters, music box, ...) |
| Characters | The player characters' voice lines |
| Interface | Menu and interface sounds |

Type in the list's search field to find a sound by name or by what plays it ("Reload",
"ak74u").

A sound the game names shows its spec name exactly as the game has it ("meteor_affirm",
"buy_success"): the name scripts play it by, `audio.play("meteor_affirm")`. Other slots are
named after what plays them: a weapon's sound is "Thundergun: Fire"; voice lines start with the
character ("Takeo: …"); a sound many weapons share names the first and how many more ("colt45
+10: Empty click"); the rest show where they live and their number ("Shared 0x…"). **Played
by** lists everything that plays the selected sound.

The game stores weapon sounds in pieces, and the names say which kind:

- **Parts** ("ak74u: Reload part 2 of 4"): a reload is several short recordings (mag out, mag
  in, bolt, ...) played in order with set waits between them (the ak74u's: 350, 350, 550 and
  250 ms), timed to the animation. Replace the part you want to change.
- **Takes** ("ak74u: Fire take 1 of 2"): a shot plays one of a few recordings picked at random,
  so firing does not sound the same every time. Replace every take for a new fire sound (the
  same sound in each is fine).

The **wave view** on the right draws the selected slot's original (grey, top) over your
replacement (orange, bottom); for one of your sounds, the recording (with what the trim cuts
shaded) over the game version. Both share one time scale, with a tick every 0.1 s.

- **Play original** plays the game's sound (as the game stores it).
- **Replace with** puts one of your saved sounds in the slot; **Play** then plays yours.
- **Reset** gives the slot its original back.

A slot is one recording of the game. Everything that plays it plays your sound: a weapon made
from another (New weapon) plays its base's sounds, so replacing one changes both.

### A weapon's own sounds

The Weapons tab's **Sounds** panel gives the selected weapon sounds of its own: for Fire, Last
round, Empty click, Reload, Reload (rounds left), Equip / pickup and Bought (player), **Use one
sound** picks one of your saved sounds. The build gives sequence fields a new sequence and
direct-play fields a new sound spec (with the volume and pitch of the sound it replaces), so:

- one recording can replace a reload the game plays in four parts, with nothing left over;
- the weapon it is made from keeps its own sounds (a new reload sound on `idgun`, from the
  [black hole example](#example-a-gun-that-opens-a-black-hole-where-it-fires), leaves the
  Thundergun's alone).

**Equip / pickup** plays when the weapon is equipped, including after a wall buy, but also on
ordinary weapon switches. **Bought (player)** is the buyer's sound on a wall purchase. The
shared wall-buy click plays separately and is not replaced by either field. These native fields
do not cover every way a weapon can be acquired. For a grant-only sound, assign a saved sound to
**Bought (player)**, then call its generated spec from the weapon script's `on_given()` callback:

```lua
function MyGun:on_given()
    boz.audio.play(self.name .. "_playerBuySound")
end
```

That callback runs for `CWeaponManager::GiveWeapon` (wall buy, mystery box, and
`player:give_weapon`). A wall purchase may also play the native **Bought (player)** field, so
this example can play the sound twice on that path; use it only when that trade-off is acceptable.

Your recording carries its own timing: line it up with the weapon's reload animation (the wave
view shows its length). **Use the game's** (✕) goes back. Below, the panel lists the game sounds
the weapon still plays, which you can replace as slots (for every weapon that plays them).

### Your sounds

**Import…** reads any file Blender's audio library reads (WAV, MP3, OGG, FLAC, AIFF, ...). The
recording is kept in the project as it is; nothing is changed until you Save.

| Setting | What it does |
| --- | --- |
| Rate | 22050 Hz (better quality; most weapon sounds) or 11025 Hz (half the size; most voices and effects). The game plays only these two. |
| Trim start / end | Seconds cut from the start and the end |
| Normalize | Brings the loudest point to -1 dB first |
| Gain | Then raises or lowers the level (dB) |
| Fade in / out | Seconds of fade at the start and the end |

Stereo recordings are mixed down to mono (the game's sounds are mono). **Recording** plays the
imported file; **Preview (game)** plays it with the settings, through the game's own compression
and back, so you hear exactly what players will. **Save** makes the game version.

### Sounds in the game

Build & Run puts your sounds in. A sound of the map's own groups is replaced in the level the
build makes; a shared or character sound is replaced in a copy of the game's group the mod
carries (the client serves a mod's files in place of the game's), so it changes wherever that
mod is enabled. The sound's volume, pitch, polyphony and everything that plays it stay the
game's.

Not yet: the streamed music (mp3 files) and placing new sound emitters.

### Sound project files

```text
source/sounds/<name>.json        the sound's settings and where it was imported from
source/sounds/<name>/source.wav  the imported recording (as read)
source/sounds/<name>/game.wav    the saved game version (mono, 16-bit, the chosen rate)
source/sounds/slots.json         {"<group path>#0x<sound hash>": "<name>"}: the filled slots
```

The formats and the slot catalog are in `bozkit/sound.py` and
[Asset formats](how-the-game-works.md#sounds-ciwsounddata-ciwsoundspec-csoundsequence).
