/**
 * @desc Used for creating the Game world of Morghol, an abandoned mineral planet
 */
import type Material from '../utils/Materials';
import Game from '../Game';
import type Loader from '../utils/Loader';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Vec3 } from 'cannon-es';
import type { Vector3 } from 'three';
import Gamestore from '../../shared/GameStore';
import { get } from 'svelte/store';
import type {
  IConnected,
  ICurrentUsers,
  ISocketMessage,
} from '../../shared/interfaces';

class MultiplayerWorld extends Game {
  private server: WebSocket;
  private userName: string;

  // Used for testing, and making sure to only send current state to server n amount of times each second.
  private counter: number = 0;

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
      'mineral.jpg',
      'space',
      '.jpg'
    );
    this.userName = get(Gamestore).username;
    this.createServerConnection();
    this.startListeningToIncomingServerEvents();
    this.createStartingZone();
    this.addPhysicalStartingZone();
    this.createPlayer();
  }

  createGameMap() {
    throw new Error('Method not implemented.');
  }

  createFinishZone() {
    throw new Error('Method not implemented.');
  }

  // Mesh of starting zone
  createStartingZone() {
    const textureLoader = this.loader.getTextureLoader();
    const groundTexture = textureLoader.load('textures/test/iceTexture.jpg');

    const planeGeometry = new THREE.PlaneBufferGeometry(200, 200, 128, 128);
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: groundTexture,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    plane.material.side = THREE.DoubleSide;

    // Move just slightly to prevent Z-Fighting
    plane.position.y = -0.2;
    this.scene.add(plane);
  }

  // Run all game related Logic inside here
  runGameLoop(timeDelta: number, elapsedTime: number) {
    if (!this.useOrbitCamera) this.gameCamera.update();

    for (const gamePiece of this.activeGamePieces) {
      gamePiece.mesh.position.copy(
        gamePiece.body.position as unknown as Vector3
      );
      gamePiece.mesh.quaternion.copy(
        gamePiece.body.quaternion as unknown as THREE.Quaternion
      );
    }
    this.updateServerOfState();
    this.world.step(1 / 100, timeDelta);
  }

  // Physical plane of starting zone
  addPhysicalStartingZone() {
    const floorShape = new CANNON.Box(new Vec3(100, 100, 0.1));
    this.createBoundry(-1, 0, 0, 0, 0, 0, Math.PI * 0.5, floorShape); // Bottom
  }

  // Send that the user has connected to server
  createServerConnection() {
    this.server = new WebSocket('ws://localhost:8000/ws');
    const connectionMessage = { msg: 'connected', username: this.userName };
    this.server.addEventListener(
      'open',
      () => this.server.send(JSON.stringify(connectionMessage)),
      {
        once: true,
      }
    );
  }

  startListeningToIncomingServerEvents() {
    this.server.addEventListener('message', this.handleServerMsg.bind(this));
  }

  // Sorts Messages based on info
  handleServerMsg(event: MessageEvent) {
    const data = JSON.parse(event.data);
    const { msg }: ISocketMessage = data;

    switch (msg) {
      case 'currentUsers':
        this.spawnExistingPlayers(data);

      case 'connected':
        this.spawnOtherPlayers(data);
        break;
      case 'update':
        break;

      default:
        console.log('Something went wrong');
        break;
    }
  }

  // Send Updates of current gamepiece to server
  updateServerOfState() {
    this.counter++;

    // Only send 6 updates / second
    if (this.counter % 10 === 0) {
      const updateMsg = {
        msg: 'update',
        username: this.userName,
        position: {
          x: this.currentGamePiece.mesh.position.x,
          y: this.currentGamePiece.mesh.position.y,
          z: this.currentGamePiece.mesh.position.z,
        },
      };
      this.server.send(JSON.stringify(updateMsg));
    }
  }

  // need to pass position etc
  spawnExistingPlayers(data: ICurrentUsers) {
    data.users.forEach((username) =>
      this.spawnOtherPlayers({ msg: 'connected', username })
    );
  }

  spawnOtherPlayers(data: IConnected) {
    // Makes sure not to spawn ball when self connecting
    if (this.userName === data.username) return;

    const startPosition = { x: 0, y: 180, z: 0 };
    const mesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(5, 64, 64),
      new THREE.MeshStandardMaterial({ map: this.gamePieceTexture })
    );
    mesh.castShadow = true;
    mesh.position.copy(startPosition as Vector3);

    // Create the physics object to match the mesh object
    const boxShape = new CANNON.Sphere(5);
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(5, 160, 0),
      shape: boxShape,
      material: this.material.getIceMaterial(),
    });
    body.position.copy(startPosition as CANNON.Vec3);

    // Add entities to the world
    this.scene.add(mesh);
    this.world.addBody(body);
    this.activeGamePieces.push({ mesh, body });
  }
}

export default MultiplayerWorld;
