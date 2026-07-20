export const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024;
export const MIN_LOGO_PX = 128;
export const RECOMMENDED_LOGO_PX = 512;

// Size/type check — synchronous, no image decode needed.
export const validateLogoFileBasics = (file: File): string | null => {
  if (file.size > MAX_LOGO_SIZE_BYTES) return "Logo must be under 5MB";
  if (!file.type.startsWith("image/")) return "Please upload a PNG, JPG, or WebP image";
  return null;
};

// Dimension check — must decode the image, so this is async. Caller owns the
// object URL: pass one in, this never revokes it (revoke after use/preview).
export const validateLogoDimensions = (objectUrl: string): Promise<string | null> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width !== img.height) {
        resolve(
          `Logo must be square — this one is ${img.width}×${img.height}px. ${RECOMMENDED_LOGO_PX}×${RECOMMENDED_LOGO_PX}px recommended.`,
        );
        return;
      }
      if (img.width < MIN_LOGO_PX) {
        resolve(
          `Logo must be at least ${MIN_LOGO_PX}×${MIN_LOGO_PX}px (${RECOMMENDED_LOGO_PX}×${RECOMMENDED_LOGO_PX}px recommended)`,
        );
        return;
      }
      resolve(null);
    };
    img.onerror = () => resolve("Could not read this image — please try another file");
    img.src = objectUrl;
  });
