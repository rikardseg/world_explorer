import type { IDimension } from './../../shared/interfaces';
/**
 * @desc Used for creating the Game world of Morghol, an abandoned mineral planet
 */
import type * as CANNON from 'cannon-es';

import PlaneFactory from '../components/Plane';
import PlatformFactory from '../components/Platform';
import Game from '../Game';
import type Loader from '../utils/Loader';
import type Material from '../utils/Materials';
import cannonDebugger from 'cannon-es-debugger';
import { getDimensions, getPosition } from '../utils/utils';

class MineralWorld extends Game {
  constructor(
    scene: THREE.Scene,
    world: CANNON.World,
    loader: Loader,
    material: Material,
    camera: THREE.PerspectiveCamera
  ) {
    super(
      scene,
      world,
      loader,
      material,
      camera,
      'moon.jpg',
      'space',
      '.jpg'
      // true
    );

    cannonDebugger(this.scene, this.world.bodies);
    this.createStartingZone();
    this.createGameMap();
    console.log(this.scene.children);
    this.scene.remove(this.scene.children[3]);
  }

  runGameLoop(timeDelta: number, elapsedTime: number) {
    if (!this.useOrbitCamera) this.gameCamera.update();
    this.updatePlaytime(elapsedTime);

    for (const gamePiece of this.activeGamePieces) {
      this.move(gamePiece, elapsedTime);
    }

    this.world.step(1 / 100, timeDelta);
  }

  createStartingZone() {
    this.createPlayer();
    this.createStartingPlane();
  }

  createGameMap() {
    this.createFirstPart();
    this.createSecondPart();
    this.createMaze();
    this.createthirdPart();
  }

  createFinishZone() {
    throw new Error('Method not implemented.');
  }

  createStartingPlane() {
    // Textures
    const colorTexture = this.loader.getTextureLoader().load('/textures/rockPlanet/Rock012_1K_Color.jpg');
    const ambientOcclusionTexture = this.loader
      .getTextureLoader()
      .load('/textures/rockPlanet/Rock012_1K_AmbientOcclusion.jpg');
    const displacementTexture = this.loader.getTextureLoader().load('/textures/rockPlanet/Rock012_1K_Displacement.jpg');
    const normalTexture = this.loader.getTextureLoader().load('/textures/rockPlanet/Rock012_1K_Normal.jpg');
    const roughnessTexture = this.loader.getTextureLoader().load('/textures/rockPlanet/Rock012_1K_Roughness.jpg');

    // Physical Plane
    const plane: IDimension = { width: 200, height: 200, depth: 0.1 };
    const { mesh, body } = PlaneFactory.createPlane(
      plane,
      this.material.getRockMaterial(),
      { x: 0, y: 0, z: 0 },
      {
        map: colorTexture,
        aoMap: ambientOcclusionTexture,
        displacementMap: displacementTexture,
        displacementScale: 1.1,
        normalMap: normalTexture,
        roughnessMap: roughnessTexture,
      }
    );

    this.scene.add(mesh);
    this.world.addBody(body);
  }

  createFirstPart() {
    const firstStraight = PlatformFactory.createPlanePlatform(
      getDimensions(40, 1, 500),
      this.material.getRockMaterial(),
      getPosition(0, -1, -350)
    );
    this.addToWorld(firstStraight);

    const firstGlassWall = PlaneFactory.createPlane(
      getDimensions(40, 1, 20),
      this.material.getGlassMaterial(),
      getPosition(0, 10, -600)
    );
    this.addToWorld(firstGlassWall);

    const secondGlassWall = PlaneFactory.createPlane(
      getDimensions(1, 40, 20),
      this.material.getGlassMaterial(),
      getPosition(20, 10, -580)
    );
    this.addToWorld(secondGlassWall);

    const firstBounceCorner = PlatformFactory.createPlanePlatform(
      getDimensions(1, 20, 40),
      this.material.getSpungeMaterial(),
      getPosition(3, 10, -585)
    );
    firstBounceCorner.mesh.rotateY(Math.PI * 0.245);
    firstBounceCorner.body.quaternion.copy(firstBounceCorner.mesh.quaternion as unknown as CANNON.Quaternion);
    this.addToWorld(firstBounceCorner);

    const secondStraight = PlatformFactory.createPlanePlatform(
      getDimensions(400, 1, 40),
      this.material.getRockMaterial(),
      getPosition(-220, -1, -580)
    );
    this.addToWorld(secondStraight);

    const ThirdStraight = PlatformFactory.createPlanePlatform(
      getDimensions(40, 1, -430),
      this.material.getRockMaterial(),
      getPosition(-440, 0 - 1, -385)
    );
    this.addToWorld(ThirdStraight);

    const thirdGlassWall = PlaneFactory.createPlane(
      getDimensions(40, 1, 20),
      this.material.getGlassMaterial(),
      getPosition(-440, 10, -600)
    );
    this.addToWorld(thirdGlassWall);

    const fourthGlassWall = PlaneFactory.createPlane(
      getDimensions(1, 40, 20),
      this.material.getGlassMaterial(),
      getPosition(-460, 10, -580)
    );
    this.addToWorld(fourthGlassWall);

    const secondBounceCorner = PlatformFactory.createPlanePlatform(
      getDimensions(1, 20, 40),
      this.material.getSpungeMaterial(),
      getPosition(-443, 10, -585)
    );
    secondBounceCorner.mesh.rotateY(-Math.PI * 0.245);
    secondBounceCorner.body.quaternion.copy(secondBounceCorner.mesh.quaternion as unknown as CANNON.Quaternion);
    this.addToWorld(secondBounceCorner);

    const fifthGlassWall = PlaneFactory.createPlane(
      getDimensions(40, 1, 20),
      this.material.getGlassMaterial(),
      getPosition(-440, 10, -170)
    );
    this.addToWorld(fifthGlassWall);

    const sixthGlassWall = PlaneFactory.createPlane(
      getDimensions(1, 68, 20),
      this.material.getGlassMaterial(),
      getPosition(-460, 10, -205)
    );
    this.addToWorld(sixthGlassWall);

    const seventhGlassWall = PlaneFactory.createPlane(
      getDimensions(1, 30, 20),
      this.material.getGlassMaterial(),
      getPosition(-420, 10, -185)
    );
    this.addToWorld(seventhGlassWall);
  }

  createSecondPart() {
    const firstClimb = PlatformFactory.createPlanePlatform(
      getDimensions(150, 1, 40),
      this.material.getGlassMaterial(),
      getPosition(-348, 21, -220)
    );
    firstClimb.mesh.rotateZ(0.3);
    firstClimb.body.quaternion.copy(firstClimb.mesh.quaternion as unknown as CANNON.Quaternion);
    this.addToWorld(firstClimb);

    const firstStraight = PlatformFactory.createPlanePlatform(
      getDimensions(140, 1, 40),
      this.material.getGlassMaterial(),
      getPosition(-180, 46, -220)
    );
    this.addToWorld(firstStraight);

    const firstRamp = PlatformFactory.createPlanePlatform(
      getDimensions(20, 1, 40),
      this.material.getGlassMaterial(),
      getPosition(-101, 51, -220)
    );
    firstRamp.mesh.rotateZ(0.5);
    firstRamp.body.quaternion.copy(firstRamp.mesh.quaternion as unknown as CANNON.Quaternion);
    this.addToWorld(firstRamp);

    const secondRamp = PlatformFactory.createPlanePlatform(
      getDimensions(20, 1, 40),
      this.material.getGlassMaterial(),
      getPosition(80, 39, -220)
    );
    secondRamp.mesh.rotateZ(-0.5);
    secondRamp.body.quaternion.copy(secondRamp.mesh.quaternion as unknown as CANNON.Quaternion);
    this.addToWorld(secondRamp);

    const secondStraight = PlatformFactory.createPlanePlatform(
      getDimensions(140, 1, 40),
      this.material.getGlassMaterial(),
      getPosition(159, 34, -220)
    );
    this.addToWorld(secondStraight);

    const firstGlassWall = PlaneFactory.createPlane(
      getDimensions(1, 40, 20),
      this.material.getGlassMaterial(),
      getPosition(230, 45, -220)
    );
    this.addToWorld(firstGlassWall);

    const secondGlassWall = PlaneFactory.createPlane(
      getDimensions(40, 1, 20),
      this.material.getGlassMaterial(),
      getPosition(210, 45, -200)
    );
    this.addToWorld(secondGlassWall);

    const elevator = PlatformFactory.createPlanePlatform(
      getDimensions(40, 1, 40),
      this.material.getGlassMaterial(),
      getPosition(210, 34, -260)
    );
    elevator.movementType = {
      start: 'sin',
      distance: 75,
      positionOffset: 110,
      speed: 0.5,
      direction: 'y',
    };

    this.addToWorld(elevator);
  }

  createMaze() {
    const mazePlane = PlatformFactory.createPlanePlatform(
      getDimensions(100, 1, 400),
      this.material.getRockMaterial(),
      getPosition(240, 185, -480)
    );
    this.addToWorld(mazePlane);

    for (let i = 1; i < 3; i++) {
      const xOffset = 100;
      const outerWalls = PlaneFactory.createPlane(
        getDimensions(1, 400, 50),
        this.material.getGlassMaterial(),
        getPosition(90 + i * xOffset, 210, -480)
      );
      this.addToWorld(outerWalls);
    }

    for (let i = 1; i < 5; i++) {
      const zOffset = 100;
      const leftSideMazeWalls = PlaneFactory.createPlane(
        getDimensions(60, 1, 50),
        this.material.getGlassMaterial(),
        getPosition(220, 210, -720 + i * zOffset)
      );
      this.addToWorld(leftSideMazeWalls);
    }

    for (let i = 1; i < 6; i++) {
      const zOffset = 100;
      const rightSideMazeWalls = PlaneFactory.createPlane(
        getDimensions(60, 1, 50),
        this.material.getGlassMaterial(),
        getPosition(260, 210, -780 + i * zOffset)
      );
      this.addToWorld(rightSideMazeWalls);
    }

    const roof = PlaneFactory.createPlane(
      getDimensions(100, 400, 1),
      this.material.getGlassMaterial(),
      getPosition(240, 235, -480)
    );
    this.addToWorld(roof);

    const exitPlane = PlatformFactory.createPlanePlatform(
      getDimensions(40, 1, 40),
      this.material.getGlassMaterial(),
      getPosition(210, 185, -700)
    );
    this.addToWorld(exitPlane);

    const firstExitGlassWall = PlaneFactory.createPlane(
      getDimensions(1, 40, 50),
      this.material.getGlassMaterial(),
      getPosition(230, 210, -700)
    );
    this.addToWorld(firstExitGlassWall);

    const secondExitGlassWall = PlaneFactory.createPlane(
      getDimensions(40, 1, 50),
      this.material.getGlassMaterial(),
      getPosition(210, 210, -720)
    );
    this.addToWorld(secondExitGlassWall);

    const exitRoof = PlaneFactory.createPlane(
      getDimensions(40, 40, 1),
      this.material.getGlassMaterial(),
      getPosition(210, 235, -700)
    );
    this.addToWorld(exitRoof);
  }

  createthirdPart() {}

  // createPlatforms() {
  //   const startingPlatform = PlatformFactory.createPlanePlatform(
  //     getDimensions(100, 2, 50),
  //     this.material.getAdamantineMaterial(),
  //     getPosition(0, 0.1, 0)
  //   );
  //   this.addToWorld(startingPlatform);

  //   for (let index = 1; index < 3; index++) {
  //     let direction: 'sin' | 'cos' = index % 2 === 0 ? 'sin' : 'cos';
  //     const zOffset = 150;
  //     const movingPlatforms = PlatformFactory.createCylinderPlatform(
  //       getCylinderDimensions(30, 30, 4, 32),
  //       this.material.getSpungeMaterial(),
  //       getPosition(0, 50, -500 + index * zOffset)
  //     );
  //     movingPlatforms.movementType = {
  //       start: direction,
  //       distance: 200,
  //       positionOffset: 0,
  //       speed: 0.5,
  //       direction: 'x',
  //     };
  //     this.addToWorld(movingPlatforms);
  //   }

  //   const largePlatform = PlatformFactory.createPlanePlatform(
  //     getDimensions(400, 4, 100),
  //     this.material.getSpungeMaterial(),
  //     getPosition(0, 50, -600)
  //   );
  //   largePlatform.movementType = {
  //     start: 'sin',
  //     distance: 50,
  //     positionOffset: 100,
  //     speed: 0.5,
  //     direction: 'y',
  //   };
  //   this.addToWorld(largePlatform);
  // }
}

export default MineralWorld;
