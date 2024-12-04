# Load Three.js from GLTF, OBJ dengan MTL, dan FBX

## Contents
1. Three.js
2. Menambahkan Loader
   - GLTF
   - OBJ dengan MTL
   - FBX

### Three.js
``Three.js`` adalah JavaScript library open-source yang dapat digunakan untuk membuat dan menampilkan 3D animasi grafik berbasis WebGL (Web Graphic Library). Dengan ``Three.js`` rendering dapat dilakukan secara real-time serta menambah efek visual dengan lebih mudah tanpa menuliskan kode WebGL yang panjang. 

Tambahkan script dibawah untuk mengaplikasikan ``Three.js``
```
<script src="http://Three.js.org/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js"></script>
```

### Memambahkan Loader
Untuk menampilkan ``Three.js``, dapat menggunakan beberapa loader sesuai dengan jenis filenya. Terdapat FBX Loader, GLTF Loader, maupun OBJ/MTL Loader

- FBX Loader: Untuk file ``.fbx`` (format yang sering digunakan dalam industri animasi).
- GLTF Loader: Untuk file ``.gltf`` (JSON format) atau ``.glb`` (binary format, format modern dan efisien untuk web).
- OBJ/MTL Loader: Untuk file ``.obj`` dan ``.mtl``.
```
<script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/FBXLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/MTLLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/OBJLoader.js"></script>
```

#### GLTF
GLTF (GL Transmission Format) mendukung animasi yang terstruktur serta mendukung dua format: ``.gltf`` (format berbasis JSON) dan ``.glb`` (format biner). Untuk memuat file GLTF atau GLB, dapat menggunakan ``GLTFLoader``.
```
let loader = new THREE.GLTFLoader();  
loader.load('scene.gltf', function(gltf){
    scene.add(gltf.scene);
    animate();
});
```

#### OBJ dengan MTL
OBJ digunakan untuk menyimpan data geometri dari posisi vertex dan face, sedangkan MTL berfungsi menyimpan informasi material, seperti warna; tekstur; dan lainnya. Keduanya tidak harus digunakan secara bersamaan.
 Catatan: Jika OBJ diaplikasikan dengan MTL, urutan pemanggilan ``mtlLoader`` harus dilakukan sebelum ``objLoader`` untuk memastikan bahwa material siap diterapkan sebelum geometri dimuat.

```
var mtlLoader = new THREE.MTLLoader();
mtlLoader.load( 'ToyCar.mtl', function( materials ) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.load( 'ToyCar.obj', function ( object ) {    
        mesh = object;
        scene.add( mesh );
    });
});
```

#### FBX
FBX (Filmbox) mendukung model kompleks dan juga animasi. FBX banyak digunakan di industri game dan efek visual. ``FBXLoader`` dapat memuat model yang memiliki animasi atau tekstur yang rumit.
 Catatan: Jika model FBX memiliki animasi, dapat menggunakan ``AnimationMixer`` dari ``Three.js`` untuk mengontrol animasinya.
```
const fbxLoader = new THREE.FBXLoader();
fbxLoader.load('ToyCar.fbx', (object) => {
    scene.add(object);
    animate();
});
```
 
## Reference
> https://medium.com/ai-fundementals/how-to-load-3d-models-using-Three.js-in-gltf-fbx-and-obj-file-formats-f62ad51b3cf8

> https://Three.js.org/docs/#manual/en/introduction/Loading-3D-models
