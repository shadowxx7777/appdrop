#!/usr/bin/env bash
set -euo pipefail

: "${MUNASBATI_KEYSTORE:?Set MUNASBATI_KEYSTORE to the private keystore path}"
: "${MUNASBATI_KEY_ALIAS:?Set MUNASBATI_KEY_ALIAS to the private key alias}"
: "${MUNASBATI_STORE_PASSWORD:?Set MUNASBATI_STORE_PASSWORD in the environment}"
: "${MUNASBATI_KEY_PASSWORD:?Set MUNASBATI_KEY_PASSWORD in the environment}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_HOME="${ANDROID_HOME:-$HOME/.android-sdk}"
UNSIGNED="$ROOT/android/app/build/outputs/apk/release/app-release-unsigned.apk"
OUTPUT="$ROOT/release/مناسباتي ✨.apk"
ALIGNED="$ROOT/release/aligned-unsigned.apk"

if [[ ! -f "$UNSIGNED" ]]; then
  echo "Missing unsigned APK: $UNSIGNED" >&2
  echo "Run npm run android:release first." >&2
  exit 1
fi
mkdir -p "$ROOT/release"
"$ANDROID_HOME/build-tools/36.0.0/zipalign" -f -p 4 "$UNSIGNED" "$ALIGNED"
"$ANDROID_HOME/build-tools/36.0.0/apksigner" sign \
  --ks "$MUNASBATI_KEYSTORE" \
  --ks-key-alias "$MUNASBATI_KEY_ALIAS" \
  --ks-pass env:MUNASBATI_STORE_PASSWORD \
  --key-pass env:MUNASBATI_KEY_PASSWORD \
  --out "$OUTPUT" \
  "$ALIGNED"
"$ANDROID_HOME/build-tools/36.0.0/apksigner" verify --verbose --print-certs "$OUTPUT"
rm -f "$ALIGNED"
echo "Signed APK: $OUTPUT"
