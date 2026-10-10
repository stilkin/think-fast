const { withAndroidManifest } = require('expo/config-plugins')

/**
 * Strips every <uses-permission> from the final merged AndroidManifest
 * (store-distribution spec): the game is fully offline, requests nothing, and
 * the Play data-safety answers / privacy page say so.
 *
 * app.json's android.permissions: [] only clears the Expo template defaults —
 * library manifests (expo-audio: RECORD_AUDIO, MODIFY_AUDIO_SETTINGS,
 * FOREGROUND_SERVICE*) still merge in. This plugin runs after all mods and
 * empties the merged list.
 *
 * The one exception is the app's own package-scoped
 * DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION: React Native requests it for
 * registerReceiver on API 33+, it is not a system permission, and removing it
 * risks a SecurityException at startup. Custom package permissions never
 * surface in the Play permission panel.
 */
module.exports = function withStrippedAndroidPermissions(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest
    const before = (manifest['uses-permission'] ?? []).length
    manifest['uses-permission'] = (manifest['uses-permission'] ?? []).filter((p) => {
      const name = p.$?.['android:name'] ?? ''
      return name === `${manifest.$?.package}.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`
    })
    console.log(
      `strip-android-permissions: ${before} -> ${manifest['uses-permission'].length} (kept the app's own receiver permission)`,
    )
    return cfg
  })
}
