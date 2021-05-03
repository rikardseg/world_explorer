import CANNON from 'cannon';
// Material for ejector
import * as THREE from 'three';

class Material {
  private iceMaterial: CANNON.Material;
  private rockMaterial: CANNON.Material;
  private spungeMaterial: CANNON.Material;
  private iceRockContactMaterial: CANNON.ContactMaterial;

  // Higher order function to create singleton instances to reduce unecessary object instantiations
  private getMaterial(
    material: CANNON.Material,
    materialName: string
  ): CANNON.Material {
    if (material) return material;
    else {
      material = new CANNON.Material(materialName);
      console.log(
        'Creating new Instance, this statement is only used for debugging'
      );

      return material;
    }
  }

  getIceMaterial(): CANNON.Material {
    if (this.iceMaterial) return this.iceMaterial;
    else {
      this.iceMaterial = new CANNON.Material('ice');
      console.log('Creating ice material');

      return this.iceMaterial;
    }
  }

  getRockMaterial(): CANNON.Material {
    if (this.rockMaterial) return this.rockMaterial;
    else {
      this.rockMaterial = new CANNON.Material('rock');
      return this.rockMaterial;
    }
  }

  getSpungeMaterial(): CANNON.Material {
    if (this.spungeMaterial) return this.spungeMaterial;
    else {
      this.spungeMaterial = new CANNON.Material('spunge');
      return this.spungeMaterial;
    }
  }

  getIceRockContactMaterial = (): CANNON.ContactMaterial => {
    return new CANNON.ContactMaterial(
      this.getRockMaterial(),
      this.getIceMaterial(),
      {
        friction: 10,
        restitution: 0,
        contactEquationRelaxation: 4,
        frictionEquationRelaxation: 10,
      }
    );
  };

  getIceIceContactMatrial = (): CANNON.ContactMaterial => {
    return new CANNON.ContactMaterial(
      this.getIceMaterial(),
      this.getIceMaterial(),
      {
        friction: 15,
        restitution: 1,
        contactEquationRelaxation: 4,
        frictionEquationRelaxation: 10,
      }
    );
  };

  getIceSpungeContactMatrial = (): CANNON.ContactMaterial => {
    return new CANNON.ContactMaterial(
      this.getIceMaterial(),
      this.getSpungeMaterial(),
      {
        friction: 2,
        restitution: 1.5,
      }
    );
  };
}

const ejectorMaterial = (): THREE.MeshPhongMaterial =>
  new THREE.MeshPhongMaterial({
    color: 0x49ef4,
    emissive: 0x0,
    shininess: 40,
  });

export default Material;