import Jimp from "jimp";
import os from "os";
import path from "path";

export async function filterImageFromURL(inputURL) {
  try {
    const response = await fetch(inputURL);

    if (!response.ok) {
      throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    const photo = await Jimp.read(imageBuffer);

    const outpath = path.join(
    os.tmpdir(),
      `filtered.${Math.floor(Math.random() * 2000)}.jpg`
      );

    await photo
      .resize(256, 256)
      .quality(60)
      .greyscale()
      .writeAsync(outpath);

    return outpath;
  } catch (error) {
    throw error;
  }
}
