// @copilot-context naming
import { Scene } from './scene';

export type Visibility = 'private' | 'draft' | 'public';

export interface ScenarioProps {
  id: string;
  title: string;
  overview: string;
  userId: string;
  visibility: Visibility;
  scenes?: Scene[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Scenario {
  readonly id: string;

  readonly userId: string;

  #title: string;

  #overview: string;

  #visibility: Visibility;

  #scenes: Scene[];

  readonly createdAt: Date;

  #updatedAt: Date;

  constructor(props: ScenarioProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.#title = props.title;
    this.#overview = props.overview;
    this.#visibility = props.visibility;
    this.#scenes = props.scenes || [];
    this.createdAt = props.createdAt || new Date();
    this.#updatedAt = props.updatedAt || new Date();
  }

  get title(): string {
    return this.#title;
  }

  get overview(): string {
    return this.#overview;
  }

  get visibility(): Visibility {
    return this.#visibility;
  }

  get scenes(): Scene[] {
    return [...this.#scenes];
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  updateTitle(title: string): void {
    this.#title = title;
    this.#updatedAt = new Date();
  }

  updateOverview(overview: string): void {
    this.#overview = overview;
    this.#updatedAt = new Date();
  }

  updateVisibility(visibility: Visibility): void {
    this.#visibility = visibility;
    this.#updatedAt = new Date();
  }

  addScene(scene: Scene): void {
    this.#scenes.push(scene);
    this.#updatedAt = new Date();
  }

  removeScene(sceneId: string): void {
    this.#scenes = this.#scenes.filter((scene) => scene.id !== sceneId);
    this.#updatedAt = new Date();
  }
}
