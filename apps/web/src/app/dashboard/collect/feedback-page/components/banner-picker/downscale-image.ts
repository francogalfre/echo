const MAX_BANNER_DIMENSION = 1600;
const BANNER_QUALITY = 0.82;

export async function downscaleImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_BANNER_DIMENSION / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return file;

  context.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", BANNER_QUALITY);
  });

  if (!blob) return file;

  return new File([blob], "banner.jpg", { type: "image/jpeg" });
}
