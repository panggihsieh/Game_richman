import { mkdir, writeFile } from "node:fs/promises";

const stages = [
  ["Ursus thibetanus formosanus", "01-formosan-black-bear.jpg"],
  ["Urocissa caerulea", "02-taiwan-blue-magpie.jpg"],
  ["Cervus nippon taiouanus", "03-formosan-sika-deer.jpg"],
  ["Lilium formosanum", "04-taiwan-lily.jpg"],
  ["Oncorhynchus masou formosanus", "05-formosan-landlocked-salmon.jpg"],
  ["Macaca cyclopis", "06-formosan-rock-macaque.jpg"],
  ["Hygrophila pogonocalyx", "07-hygrophila-pogonocalyx.jpg"],
  ["Agehana maraho", "08-broad-tailed-swallowtail.jpg"],
  ["Hynobius formosanus", "09-formosan-salamander.jpg"],
  ["Pleione formosana", "10-taiwan-pleione.jpg"],
  ["Pomacea canaliculata", "11-golden-apple-snail.jpg"],
  ["Oreochromis niloticus", "12-nile-tilapia.jpg"],
  ["Mikania micrantha", "13-mile-a-minute-weed.jpg"],
  ["Procambarus clarkii", "14-red-swamp-crayfish.jpg"],
  ["Iguana iguana", "15-green-iguana.jpg"],
  ["Microhyla fissipes", "16-ornate-narrow-mouthed-frog.jpg"],
  ["Solenopsis invicta", "17-red-imported-fire-ant.jpg"],
  ["Bidens pilosa radiata", "18-bidens-pilosa.jpg"],
  ["Acridotheres tristis", "19-common-myna.jpg"],
  ["Hypostomus plecostomus", "20-suckermouth-catfish.jpg"]
];

const outputDir = new URL("../assets/stages/", import.meta.url);
await mkdir(outputDir, { recursive: true });

for (const [scientific, filename] of stages) {
  const query = encodeURIComponent(scientific);
  const response = await fetch(`https://api.inaturalist.org/v1/taxa?q=${query}&per_page=1`);
  if (!response.ok) {
    throw new Error(`Taxa lookup failed for ${scientific}: ${response.status}`);
  }

  const data = await response.json();
  const photo = data.results?.[0]?.default_photo;
  const photoUrl = photo?.medium_url || photo?.url || photo?.square_url;
  if (!photoUrl) {
    throw new Error(`No photo found for ${scientific}`);
  }

  const imageResponse = await fetch(photoUrl);
  if (!imageResponse.ok) {
    throw new Error(`Image download failed for ${scientific}: ${imageResponse.status}`);
  }

  const bytes = new Uint8Array(await imageResponse.arrayBuffer());
  await writeFile(new URL(filename, outputDir), bytes);
  console.log(`${filename} <- ${photoUrl}`);
}
