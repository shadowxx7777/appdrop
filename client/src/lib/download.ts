const APK_MIME_TYPE = "application/vnd.android.package-archive";

export async function downloadApk(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`APK download failed: ${response.status}`);

  const source = await response.blob();
  const apk = new Blob([source], { type: APK_MIME_TYPE });
  const objectUrl = URL.createObjectURL(apk);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
}
