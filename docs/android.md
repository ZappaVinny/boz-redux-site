# Playing on Android

BOZ Redux runs on Android phones and tablets too, with the same mods and maps as on PC. This page
takes you from download to your first match. No game files come with BOZ Redux: you need your own
copy of the original game.

## What you need

- An Android phone or tablet with Android 8 or newer and a 64-bit processor (almost every phone
  from the last few years).
- Your own copy of the original *Call of Duty: Black Ops Zombies* APK, version 1.0.11.
- Wi-Fi for the game's data packs (825 MB), or the packs already copied to your phone.

## 1. Download the client

On your phone, open the [BOZ Redux releases](https://github.com/ZappaVinny/boz-redux/releases)
and download `BOZ-Redux-android-arm64.apk` from the newest release.

## 2. Install it

1. Open the downloaded file (from the browser's downloads, or your Files app).
2. Android asks whether the app you opened it from may install apps (**Install unknown apps**).
   Allow it for that app, then go back.
3. Tap **Install**, then **Open**.

Android asks because BOZ Redux comes from GitHub instead of the Play Store. You can switch the
permission off again afterwards in Settings.

## 3. Install the game files

BOZ Redux opens on the **GAME FILES** tab. A box at the top lists what's left to do.

1. Under **1. Game APK**, tap **Choose the APK file...** and pick your own Black Ops Zombies APK.
   The status line says **Installed: version 1.0.11** when it's done.
2. Under **2. Data packs**, tap **Download from Activision (825 MB)**, and wait for both packs.

   Already have the packs? Tap **Import files...** instead and choose `blackops_etc.dz` and
   `blackops_gles1.dz`, or the game's `.obb` file.

When both lines in the box at the top turn green, you're ready.

## 4. Play

Tap **PLAY**. Choose **MAIN MENU** for the game as it shipped, or a map from one of your mods,
and **SOLO** or **CO-OP**. The game uses its own touch controls. The launcher works upright or
sideways; the game always plays sideways.

## Mods on your phone

Mods come as `.zip` files, the same ones PC players use.

1. Download the mod's `.zip` to your phone.
2. In the launcher, open **MODS** and tap **Install a mod (.zip)...**, then pick the file.
3. Its maps appear on the **PLAY** screen.

To update a mod, install the newer `.zip` the same way: the launcher shows both versions and asks
first. Each mod in the list has **Remove...** to take it off again. Some mods change their
windows to suit a touch screen on their own.

## Co-op

Phones and PCs play together. Everyone joins the same Wi-Fi, picks the same map and taps
**CO-OP**. Every player needs the mod that adds the map.

## Online

**Play Online**, in the game's Multiplayer menu, needs a BOZ server: a server running
[cod-boz-online](https://github.com/Producdevity/cod-boz-online). BOZ Redux has none of its own.

1. In the launcher, open **SETTINGS** → **Online**.
2. Type the server's name or IP address and tap **Add server**.
3. The launcher checks that it really is a BOZ server before adding it. If it isn't, or nothing
   answers, it says what's wrong.

Everyone who plays together chooses the same server. **Off** keeps Wi-Fi co-op only.

## Field of view

**SETTINGS** → **Player & display** → **Field of view** widens or narrows the view. It uses
the game's own number: most maps use 50. **Map's own** goes back to each map's view. Aiming down
sights still zooms.

## Updates

When a new version of BOZ Redux is out, a line at the top of the launcher says so. Tap **Update now**:
it downloads the new APK and Android asks you to tap **Install**. Your game files, saves and mods
stay where they are. **What's new** shows what changed, and **Later** hides the notice until the
next start.

## If something goes wrong

- **"This APK is not the 1.0.11 release".** BOZ Redux only runs version 1.0.11. Older
  versions (such as 1.0.8.7) and changed copies would start, but mods and the Developer console
  can't work with them, so PLAY stays off. Choose your original 1.0.11 APK instead.
- **"App not installed" when updating.** The copy on your phone came from a different build
  (a test build, for example). Uninstall it, then install the new one. Uninstalling also removes
  its game files, so you'll do step 3 again.
- **A data pack won't download.** Check your connection and tap **Download** again, or copy the
  packs from a PC and use **Import files...**.
- **The game closes or misbehaves.** The log is `boz-log.txt` in
  `Android/data/org.bozredux.client/files/game/`. Share it when you ask for help on the Discord.
