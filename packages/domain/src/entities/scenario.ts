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

  private _title: string;

  private _overview: string;

  private _visibility: Visibility;

  private _scenes: Scene[];

  readonly createdAt: Date;

  private _updatedAt: Date;

  constructor(props: ScenarioProps) {
    this.id = props.id;
    this.userId = props.userId;
    this._title = props.title;
    this._overview = props.overview;
    this._visibility = props.visibility;
    this._scenes = props.scenes || [];
    this.createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get title(): string {
    return this._title;
  }

  get overview(): string {
    return this._overview;
  }

  get visibility(): Visibility {
    return this._visibility;
  }

  get scenes(): Scene[] {
    return [...this._scenes];
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateTitle(title: string): void {
    this._title = title;
    this._updatedAt = new Date();
  }

  updateOverview(overview: string): void {
    this._overview = overview;
    this._updatedAt = new Date();
  }

  updateVisibility(visibility: Visibility): void {
    this._visibility = visibility;
    this._updatedAt = new Date();
  }

  addScene(scene: Scene): void {
    this._scenes.push(scene);
    this._updatedAt = new Date();
  }

  removeScene(sceneId: string): void {
    this._scenes = this._scenes.filter((scene) => scene.id !== sceneId);
    this._updatedAt = new Date();
  }
}
