const { withAndroidManifest } = require('expo/config-plugins')

/**
 * Strips unwanted <uses-permission> entries from the FINAL merged Android
 * manifest (store-distribution spec): the game is fully offline, requests
 * nothing, and the Play data-safety answers / privacy page say so.
 *
 * app.json's android.permissions: [] only clears the Expo template defaults,
 * and clearing the app manifest's list is not enough either — library AAR
 * manifests (expo-audio: RECORD_AUDIO, MODIFY_AUDIO_SETTINGS,
 * FOREGROUND_SERVICE*) merge back in at gradle time. The correct lever is a
 * tools:node="remove" marker per permission, which the manifest merger honors
 * across library manifests. (Learned the hard way on build 423478e4: the
 * naive empty-list approach still shipped 10 permissions.)
 *
 * The app's own package-scoped DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION is
 * kept: React Native needs it for registerReceiver on API 33+, it is not a
 * system permission, and custom package permissions never surface in the
 * Play permission panel.
 */
const REMOVE = [
  'android.permission.RECORD_AUDIO',
  'android.permission.MODIFY_AUDIO_SETTINGS',
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
  'android.permission.INTERNET',
  'android.permission.ACCESS_NETWORK_STATE',
  'android.permission.WAKE_LOCK',
  'android.permission.VIBRATE',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.SYSTEM_ALERT_WINDOW',
]

module.exports = function withStrippedAndroidPermissions(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest
    manifest.$ = manifest.$ ?? {}
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools'
    const kept = (manifest['uses-permission'] ?? []).filter(
      (p) =>
        p?.$?.['android:name'] === `${manifest.$.package}.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`,
    )
    manifest['uses-permission'] = [
      ...kept,
      ...REMOVE.map((name) => ({ $: { 'android:name': name, 'tools:node': 'remove' } })),
    ]
    console.log(
      `strip-android-permissions: keeping ${kept.length}, remove-marking ${REMOVE.length} across merged library manifests`,
    )
    return cfg
  })
}
