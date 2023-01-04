import { createCanvas, Image } from "canvas";
import fs from "fs";
import path from "path";
export class GetAverageColors {
  imagePath: string = path.join(__dirname, "../assets/img.jpg");
  file = fs.readFileSync(this.imagePath, { encoding: "utf8" });

  async main(): Promise<void> {
    let averagColor = await this.getAverageColor(this.imagePath);
    console.log("Average color is \t" + averagColor);
  }

  async getAverageColor(imageUrl: string): Promise<number[]> {
    const image = await this.loadImage(imageUrl);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    let rSum: number = 0;
    let gSum: number = 0;
    let bSum: number = 0;
    let aSum: number = 0;

    // why 4 value jump?
    /*Because it is a 1-d array with 4 values corresponding to 
    red, green, blue and alpha values.
    so [1,4,5,6,2,4,5,6] => first 4 elements 1 iteration
    */
    for (let i = 0; i < data.length; i += 4) {
      rSum += data[i];
      gSum += data[i + 1];
      bSum += data[i + 2];
      aSum += data[i + 3];
    }

    const pixelCount = data.length / 4;

    const rAvg = rSum / pixelCount;
    const gAvg = gSum / pixelCount;
    const bAvg = bSum / pixelCount;
    const aAvg = aSum / pixelCount;

    const avgColor: number[] = [rAvg, gAvg, bAvg, aAvg];

    return avgColor;
  }

  async loadImage(imageUrl: string): Promise<Image> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = imageUrl;
    });
  }
}
