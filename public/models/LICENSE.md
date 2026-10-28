# Licence for the anatomy models in this folder

`body-desktop.glb` and `body-mobile.glb` are derived from **BodyParts3D**,
© The Database Center for Life Science, licensed under
Creative Commons Attribution-Share Alike 2.1 Japan (CC BY-SA 2.1 JP):
https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en

Source: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/

Changes made: organ parts were merged per organ, simplified, re-oriented to metres with Y up, quantised and meshopt-compressed. Lung surfaces were generated from the dataset's bronchial and pulmonary vascular trees (voxel closing and a surface-nets isosurface), because BodyParts3D 4.0 contains no lung surface mesh. The process is reproducible with `scripts/build-anatomy.mjs`.

These derived models are distributed under the same CC BY-SA 2.1 JP licence. The licence applies to these model files only, not to the application source code.
