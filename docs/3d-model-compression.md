# 3D Model Compression

Raw `.glb` exports are stored uncompressed: float32 positions and normals, one
vertex at a time. A CAD assembly runs to hundreds of megabytes, which blows past
GitHub's 100 MB per-file push limit and — more to the point — ships in full to
every visitor, since models are imported as Vite assets and emitted to `_astro/`.

Every model in `src/content/` has been through the pass below. Measured results:

| Model | Raw | Compressed |
|---|---|---|
| 3DPrinter.glb | 136.3 MB | 10.30 MB |
| spinny_boiii_v3.glb | 77.5 MB | 9.77 MB |
| vertV4.glb | 30.6 MB | 6.33 MB |
| horizV4.glb | 26.3 MB | 6.22 MB |
| mini-boi.glb | 9.4 MB | 2.30 MB |

No triangles were removed. The savings are Draco quantization plus deduplicating
materials — the printer's 83 materials collapsed to 3 and a small palette texture.

## The command

```sh
npx @gltf-transform/cli@4.4.2 optimize in.glb out.glb \
  --compress draco \
  --simplify false \
  --instance false \
  --texture-compress false
```

Run it on a copy and replace the file in `src/content/` — the repo holds only the
compressed version. Keep raw exports outside the repo.

Why each flag is off:

- **`--simplify false`** — on by default, and it is the one genuinely *lossy*
  pass: it decimates triangles. With the flags below it buys little — the printer
  goes 10.30 → 8.26 MB, 20% — while eating fine CAD detail like threads and
  fillets. Poor trade here. Worth revisiting only for framerate on a model that
  actually stutters, and look at the result when you do.
- **`--instance false`** — the instancing pass emits `EXT_mesh_gpu_instancing`,
  which model-viewer's material-variants code cannot associate with a primitive.
  It logs `Mesh is missing primitive index association` once per instanced mesh
  (15 errors on the printer page) and bails out of setting up the scene-graph
  material API. Rendering is unaffected and nothing here uses `variant=`, so this
  is a choice: ~30% smaller files versus a clean console. Currently: clean
  console. Flip it if page weight ever matters more.
- **`--texture-compress false`** — these models carry no real textures, only the
  tiny generated palette. Turn it on for anything actually textured.

## Verifying

The `load` event is the real test — it only fires after Draco decodes.

```sh
npm run build && npm run preview
```

Open the project page, scroll the viewer into view, and confirm in the console:

```js
document.querySelector('model-viewer').loaded  // true
```

Check for zero console errors, and eyeball transparent and clearcoat parts —
material merging is where a bad pass shows up first.

No app code is involved. `@google/model-viewer` decodes
`KHR_draco_mesh_compression` natively, fetching the decoder from
`https://www.gstatic.com/draco/versioned/decoders/1.5.6/`. That is a third-party
request; to self-host it, set `ModelViewerElement.dracoDecoderLocation`.

## Reducing the export from Blender

Compression is the last step, not the first. Triangle count is set upstream, and
cutting it there beats compressing a bloated mesh.

- **Tessellate coarsely at the CAD source.** For a Fusion 360 export, refinement
  is the single biggest lever — "Low" or a custom setting with a larger surface
  deviation. Curved surfaces are where the triangles go; a fine setting spends
  millions of them on detail no web viewer resolves.
- **Delete what nobody sees.** Internal fasteners, parts sealed inside
  enclosures, backs of PCBs. On a full assembly this is often most of the mesh.
- **Decimate → Planar** (angle ~1–5°) suits CAD well: it merges coplanar
  triangles across flat faces without moving the silhouette. Extrusions, panels
  and brackets shrink a lot; curves are left alone. Prefer it to Collapse mode,
  which distorts hard edges.
- **Watch for Subdivision Surface modifiers.** Left enabled with "Apply
  Modifiers" on, one multiplies triangles by 4× per level at export.

In the glTF 2.0 exporter:

- **Include → Limit to Selected/Visible** so hidden collections stay out.
- **Data → Mesh**: uncheck UVs, vertex colors and tangents if unused. Normals
  are needed for CAD shading; leave them on and let Draco quantize them.
- **Animation**: uncheck entirely for a static model. It is on by default and
  serialises keyframes for anything rigged.
- **Compression**: the exporter has its own Draco checkbox. Fine as a shortcut,
  but the command above additionally dedups materials, welds and prunes, so
  prefer it for anything going into the repo.

## Gotchas

- Push the compressed file, not the raw one. GitHub rejects >100 MB at
  `pre-receive`, and if the blob is in *any* commit in the push, deleting it in a
  later commit does not help — the commit that introduced it has to be amended or
  the branch rewritten.
- `modelSrc` must be an imported `.glb`, never a string path. See
  [content-layout-system.md](content-layout-system.md).
- `.glb`/`.gltf` are registered in `astro.config.mjs` under `vite.assetsInclude`.
